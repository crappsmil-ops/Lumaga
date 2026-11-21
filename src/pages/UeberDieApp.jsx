import { Link } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import BackButton from "@/components/BackButton";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";

function Section({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-2 font-body text-sm">
      <p className="font-heading font-semibold text-base mb-1">{title}</p>
      {children}
    </div>
  );
}

export default function UeberDieApp() {
  return (
    <div className="min-h-screen bg-background flex flex-col p-6 pt-safe relative">
      <BackButton />

      <div className="max-w-md w-full mx-auto pt-14 pb-12 space-y-4">
        <div>
          <h1 className="text-3xl font-heading font-black mb-1">Über die App</h1>
          <p className="text-muted-foreground font-body text-sm">Impressum &amp; Datenschutz</p>
        </div>

        <Section title="Haftungsausschluss">
          <p>
            Die Inhalte dieser App wurden mit größtmöglicher Sorgfalt erstellt.
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
            kann keine Gewähr übernommen werden.
          </p>
          <p>
            Die App richtet sich ausschließlich an Personen, die mindestens 16 Jahre alt sind.
          </p>
        </Section>

        {/* DATENSCHUTZ */}
        <div className="pt-2">
          <h2 className="text-xl font-heading font-black mb-3">Datenschutz</h2>
        </div>

        <Link to="/datenschutz" className="block">
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-heading font-semibold text-base">Datenschutzerklärung</p>
                <p className="font-body text-xs text-muted-foreground">
                  Stand: {PRIVACY_POLICY.stand}
                </p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-muted-foreground -rotate-180" />
          </div>
        </Link>

        {/* ANGABEN BETREIBER */}
        <div className="pt-2">
          <h2 className="text-xl font-heading font-black mb-3">Impressum</h2>
          <p className="text-muted-foreground font-body text-xs mb-4">Angaben gemäß § 5 DDG</p>
        </div>

        <Section title="Betreiber">
          <p>Christian Raab</p>
          <p>Tulpenweg 9</p>
          <p>63579 Freigericht</p>
          <p>Deutschland</p>
          <p className="mt-1">
            E-Mail:{" "}
            <a
              href="mailto:crappsmil@gmail.com"
              className="text-primary underline underline-offset-2"
            >
              crappsmil@gmail.com
            </a>
          </p>
        </Section>

        <p className="text-xs text-muted-foreground font-body text-center">
          Stand: November 2026
        </p>
      </div>
    </div>
  );
}
