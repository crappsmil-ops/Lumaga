import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

/**
 * Standardized back button with consistent absolute top-left positioning
 * and safe-area offset across all pages.
 */
export default function BackButton({ iconOnly = false, label, to }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const text = label || t(lang, "setup_back");
  return (
    <button
      onClick={() => navigate(to ?? -1)}
      aria-label={text}
      className="absolute top-[calc(1.25rem+env(safe-area-inset-top))] left-4 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors z-20 min-h-[44px] py-2 px-2"
    >
      <ChevronLeft className="w-5 h-5" />
      {!iconOnly && <span className="font-body text-sm">{text}</span>}
    </button>
  );
}