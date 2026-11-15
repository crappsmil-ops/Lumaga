import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TAB_ROOTS = ["/", "/mydeck", "/settings"];

export function getTabForPath(path) {
  if (path.startsWith("/lobby") || path.startsWith("/multiplayer")) return "/";
  if (path.startsWith("/mydeck")) return "/mydeck";
  if (path.startsWith("/settings") || path.startsWith("/support"))
    return "/settings";

  return "/";
}

const TabHistoryContext = createContext(null);

export function TabHistoryProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const stacksRef = useRef({
    "/": ["/"],
    "/mydeck": ["/mydeck"],
    "/settings": ["/settings"],
  });

  const [currentTab, setCurrentTab] = useState(() =>
    getTabForPath(location.pathname)
  );

  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    const tab = getTabForPath(location.pathname);
    const stack = stacksRef.current[tab];
    const top = stack[stack.length - 1];

    if (location.pathname !== top) {
      const prevTab = getTabForPath(lastPathRef.current);

      if (tab === prevTab) {
        const secondFromTop = stack[stack.length - 2];

        if (secondFromTop === location.pathname) {
          stack.pop();
        } else {
          stack.push(location.pathname);
        }
      } else if (top !== location.pathname) {
        stack.push(location.pathname);
      }
    }

    setCurrentTab(tab);
    lastPathRef.current = location.pathname;
  }, [location.pathname]);

  const switchTab = useCallback(
    (to) => {
      if (to === currentTab) {
        stacksRef.current[to] = [to];

        if (location.pathname !== to) {
          navigate(to);
        }
      } else {
        const targetStack = stacksRef.current[to];
        const top = targetStack[targetStack.length - 1] || to;

        navigate(top);
      }
    },
    [currentTab, location.pathname, navigate]
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