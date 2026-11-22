import React, { createContext, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TAB_ROOTS = ["/", "/mydeck", "/settings"];

export function getTabForPath(path) {
  if (path.startsWith("/mydeck")) return "/mydeck";
  if (
    path.startsWith("/settings") ||
    path.startsWith("/support") ||
    path.startsWith("/ueber-die-app") ||
    path.startsWith("/datenschutz")
  ) {
    return "/settings";
  }
  return "/";
}

const TabHistoryContext = createContext(null);

// Die untere Leiste führt immer zuverlässig zur Startseite des jeweiligen Tabs.
// (Früher wurden Unterseiten pro Tab gemerkt – das führte zu falschen Zielen.)
export function TabHistoryProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = getTabForPath(location.pathname);

  const switchTab = useCallback(
    (to) => {
      if (location.pathname !== to) {
        navigate(to);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <TabHistoryContext.Provider
      value={{
        switchTab,
        currentTab,
        tabRoots: TAB_ROOTS,
      }}
    >
      {children}
    </TabHistoryContext.Provider>
  );
}

export function useTabHistory() {
  return useContext(TabHistoryContext);
}
