import { Link } from "react-router-dom";
import { ChevronLeft, FileText, Info, ShieldCheck } from "lucide-react";
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

function LinkCard({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-heading font-semibold text-base">{title}</p>
          {subtitle && (
            <p className="font-body text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <ChevronLeft className="w-5 h-5 text-muted-foreground -rotate-180" />
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
          <p className="text-muted-foreground font-body text-sm">
            Rechtliches &amp; Informationen
          </p>
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

        <div className="pt-2">
          <h2 className="text-xl font-heading font-black mb-3">Rechtliches</h2>
        </div>

        <Link to="/datenschutz" className="block">
          <LinkCard
            icon={ShieldCheck}
            title="Datenschutzerklärung"
            subtitle={`Stand: ${PRIVACY_POLICY.stand}`}
          />
        </Link>

        <Link to="/impressum" className="block">
          <LinkCard icon={Info} title="Impressum" subtitle="Angaben gemäß § 5 DDG" />
        </Link>

        <a href="/lumaga-agb.html" className="block">
          <LinkCard
            icon={FileText}
            title="AGB & Widerrufsbelehrung"
            subtitle="Bedingungen für Käufe"
          />
        </a>
      </div>
    </div>
  );
}
