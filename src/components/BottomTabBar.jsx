import { useLocation } from "react-router-dom";
import { Gamepad, Layers, Settings } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { useTabHistory } from "@/lib/TabHistoryContext";

export default function BottomTabBar() {
  const location = useLocation();
  const { lang } = useLanguage();
  const { switchTab, currentTab } = useTabHistory();

  const tabs = [
    { to: "/", icon: Gamepad, label: t(lang, "tab_play") },
    { to: "/mydeck", icon: Layers, label: t(lang, "tab_deck") },
    { to: "/settings", icon: Settings, label: t(lang, "tab_settings") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe select-none">
      <div className="flex items-stretch h-14">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = currentTab === to;

          return (
            <button
              key={to}
              type="button"
              onClick={() => switchTab(to)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}