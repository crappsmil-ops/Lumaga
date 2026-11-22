// Erzeugt den Inhalt von public/lumaga-datenschutz.html aus src/lib/privacyPolicy.js,
// damit die Seite /datenschutz in der App und die statische Seite denselben Text zeigen.
// Kopf, Styles, Navigation und Fußzeile der HTML-Datei bleiben unverändert.
//
// Aufruf: npm run build:privacy

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "public", "lumaga-datenschutz.html");
const { PRIVACY_POLICY } = await import(
  pathToFileURL(path.join(root, "src", "lib", "privacyPolicy.js")).href
);

const LINK_PATTERN = /(https?:\/\/[^\s,]+|[\w.+-]+@[\w-]+\.[a-z]{2,})/gi;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linked(text) {
  return text
    .split(LINK_PATTERN)
    .map((part, index) => {
      if (index % 2 === 0) return escapeHtml(part);

      const trailing = part.match(/[.)]+$/)?.[0] ?? "";
      const value = trailing ? part.slice(0, -trailing.length) : part;
      const href = value.includes("@") && !value.startsWith("http")
        ? `mailto:${value}`
        : value;
      const external = href.startsWith("http")
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";

      return `<a href="${escapeHtml(href)}"${external}>${escapeHtml(value)}</a>${escapeHtml(trailing)}`;
    })
    .join("");
}

function renderBlock(block) {
  switch (block.type) {
    case "h2":
      return block.id
        ? `<h2 id="${escapeHtml(block.id)}">${escapeHtml(block.text)}</h2>`
        : `<h2>${escapeHtml(block.text)}</h2>`;
    case "h3":
      return `<h3>${escapeHtml(block.text)}</h3>`;
    case "ul":
      return `<ul>${block.items.map((item) => `<li>${linked(item)}</li>`).join("")}</ul>`;
    default:
      return `<p>${linked(block.text)}</p>`;
  }
}

const main =
  `<main><p><strong>Stand: ${escapeHtml(PRIVACY_POLICY.stand)}</strong></p>` +
  PRIVACY_POLICY.blocks.map(renderBlock).join("") +
  `</main>`;

const html = readFileSync(htmlPath, "utf8");

if (!/<main>[\s\S]*<\/main>/.test(html)) {
  throw new Error("Kein <main>-Bereich in lumaga-datenschutz.html gefunden");
}

let updated = html
  .replace(/<main>[\s\S]*<\/main>/, main)
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Datenschutzerklärung der Lumaga-Web-App">'
  );

// Stil für Unterabschnitte (7.1, 17.1) nur einmal ergänzen.
if (!updated.includes("h3{font-size:1rem")) {
  updated = updated.replace(
    /h2\{/,
    "h3{font-size:1rem;margin:22px 0 10px;color:#152f50}h2{"
  );
}

writeFileSync(htmlPath, updated);
console.log(
  `lumaga-datenschutz.html aktualisiert (${PRIVACY_POLICY.blocks.length} Blöcke, Stand ${PRIVACY_POLICY.stand})`
);
