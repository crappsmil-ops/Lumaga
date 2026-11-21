import BackButton from "@/components/BackButton";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";

const LINK_PATTERN = /(https?:\/\/[^\s,]+|[\w.+-]+@[\w-]+\.[a-z]{2,})/gi;

// Macht URLs und E-Mail-Adressen im Fließtext anklickbar.
function LinkedText({ text }) {
  return text.split(LINK_PATTERN).map((part, index) => {
    if (index % 2 === 0) return part;

    const trailing = part.match(/[.)]+$/)?.[0] ?? "";
    const value = trailing ? part.slice(0, -trailing.length) : part;
    const href = value.includes("@") && !value.startsWith("http")
      ? `mailto:${value}`
      : value;

    return (
      <span key={index}>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 break-all"
        >
          {value}
        </a>
        {trailing}
      </span>
    );
  });
}

function Block({ block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="text-lg font-heading font-black pt-6 first:pt-0 leading-snug">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-base font-heading font-bold pt-3 leading-snug">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="list-disc pl-5 space-y-1">
          {block.items.map((item, index) => (
            <li key={index}>
              <LinkedText text={item} />
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p>
          <LinkedText text={block.text} />
        </p>
      );
  }
}

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background flex flex-col p-6 pt-safe relative">
      <BackButton />

      <div className="max-w-md w-full mx-auto pt-14 pb-12">
        <h1 className="text-3xl font-heading font-black mb-1">
          Datenschutzerklärung
        </h1>
        <p className="text-muted-foreground font-body text-sm mb-6">
          Stand: {PRIVACY_POLICY.stand}
        </p>

        <div className="bg-card border border-border rounded-2xl p-5 font-body text-sm leading-relaxed space-y-3 break-words">
          {PRIVACY_POLICY.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}
