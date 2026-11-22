import { useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

// Wohin "Zurück" führt, wenn es keine vorherige Seite in der App gibt
// (z. B. nach dem Neuladen, nach einem Kauf oder beim Start der installierten App).
function getParentPath(pathname) {
  if (pathname.startsWith("/setup/players")) return "/setup";
  if (
    pathname === "/game" ||
    pathname === "/results" ||
    pathname.endsWith("/spiel")
  ) {
    return "/setup";
  }
  if (
    pathname.startsWith("/support") ||
    pathname.startsWith("/ueber-die-app") ||
    pathname.startsWith("/datenschutz")
  ) {
    return "/settings";
  }
  return "/";
}

function hasInAppHistory() {
  const idx = window.history.state?.idx;
  return typeof idx === "number" && idx > 0;
}

/**
 * Standardized back button with consistent absolute top-left positioning
 * and safe-area offset across all pages.
 */
export default function BackButton({ iconOnly = false, label, to }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const text = label || t(lang, "setup_back");
  const busyRef = useRef(false);

  const handleClick = () => {
    // Doppeltes Tippen soll nicht zwei Seiten zurückspringen.
    if (busyRef.current) return;
    busyRef.current = true;
    setTimeout(() => {
      busyRef.current = false;
    }, 400);

    if (to) {
      navigate(to);
    } else if (hasInAppHistory()) {
      navigate(-1);
    } else {
      navigate(getParentPath(location.pathname), { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={text}
      className="absolute top-[calc(1.25rem+env(safe-area-inset-top))] left-4 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors z-20 min-h-[44px] py-2 px-2"
    >
      <ChevronLeft className="w-5 h-5" />
      {!iconOnly && <span className="font-body text-sm">{text}</span>}
    </button>
  );
}
