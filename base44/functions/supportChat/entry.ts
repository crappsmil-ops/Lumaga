import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const ADMIN_EMAIL = "jachra09@gmail.com";

const SYSTEM_PROMPT = `Du bist der Support-Bot von Trinkluma, einer Party-Trinkspiel-App mit Fragen und Mutproben.
Du nimmst den ersten Kontakt entgegen und beantwortest kleinere Themen freundlich, kurz und hilfreich auf Deutsch.

Folgendes weißt du über Trinkluma:
- Es ist ein Trinkspiel: Spieler beantworten Fragen oder machen Mutproben, sonst trinken sie.
- Es gibt einen HOT Modus (Premium, einmalig 0,99€) mit pikanten Karten & Aktionen.
- Es gibt einen Multiplayer-Modus mit Raumcodes zum Zusammen spielen.
- Es gibt einen alkoholfreien Modus (Wasser statt Schlücke).
- Nutzer können eigene Fragen & Aktionen hinzufügen.
- Einstellungen: Sprache, Konto.

Regel für Eskalation:
Wenn die Frage ein komplexes Problem, einen Fehler/Bug, Zahlungen, Rückerstattungen, Kontolöschung oder etwas betrifft, das ein Mensch klären muss, antworte kurz, dass sich das Team darum kümmert, und setze "needs_human" auf true.
Bei einfachen Fragen (Spielregeln, HOT Modus, Multiplayer, Einstellungen) setze "needs_human" auf false.

Antworte IMMER als JSON-Objekt mit den Feldern "reply" (deine Antwort an den Nutzer) und "needs_human" (boolean).`;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const action = body?.action;

    // Load recent conversation history
    if (action === 'load') {
      const messages = await base44.asServiceRole.entities.ChatMessage.filter(
        { user_id: user.id },
        'created_date',
        50
      );
      return Response.json({ messages: messages.reverse() });
    }

    // Send a new user message and get bot reply
    if (action === 'send') {
      const text = (body?.message || "").trim();
      if (!text) return Response.json({ error: 'Nachricht fehlt' }, { status: 400 });

      // Store user message
      await base44.asServiceRole.entities.ChatMessage.create({
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name || user.email,
        sender: 'user',
        text
      });

      // Load recent history for context
      const recent = await base44.asServiceRole.entities.ChatMessage.filter(
        { user_id: user.id },
        '-created_date',
        10
      );
      const history = recent.reverse().map(m => `${m.sender === 'user' ? 'Nutzer' : 'Bot'}: ${m.text}`).join('\n');

      const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nKonversationsverlauf:\n${history || '(noch keine)'}\n\nNutzerfrage: ${text}`,
        response_json_schema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            needs_human: { type: "boolean" }
          },
          required: ["reply", "needs_human"]
        }
      });

      const reply = llm.reply || "Da ist leider etwas schiefgelaufen. Bitte versuche es später erneut.";
      const needsHuman = !!llm.needs_human;

      // Store bot reply
      await base44.asServiceRole.entities.ChatMessage.create({
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name || user.email,
        sender: 'bot',
        text: reply,
        needs_human: needsHuman
      });

      // Notify admin when escalation needed
      if (needsHuman) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: ADMIN_EMAIL,
            subject: `Neue Support-Anfrage von ${user.full_name || user.email}`,
            body: `Nutzer: ${user.full_name || user.email}\nE-Mail: ${user.email}\n\nNachricht:\n${text}\n\nBot-Antwort:\n${reply}\n\n(Eskalation: Menschliche Bearbeitung erforderlich)`
          });
        } catch (e) {
          // email forwarding failed (recipient may not be registered) — message is stored
        }
      }

      return Response.json({ reply, needs_human: needsHuman });
    }

    return Response.json({ error: 'Unbekannte Aktion' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}