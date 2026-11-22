import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BottomTabBar from "@/components/BottomTabBar";
import { subscribeDisclaimer } from "@/lib/disclaimerState";

const TAB_ROUTES = ["/", "/mydeck", "/settings"];

// Subtle iOS-style push/pop slide distance (px).
const SLIDE = 16;

export default function TransitionLayout() {
  const location = useLocation();
  const [disclaimerActive, setDisclaimerActive] = useState(false);

  useEffect(() => {
    return subscribeDisclaimer(setDisclaimerActive);
  }, []);

  const showTabBar =
    TAB_ROUTES.includes(location.pathname) && !disclaimerActive;

  // Richtung (vor/zurück) für die Einblend-Animation bestimmen.
  // Wird während des Renderns berechnet, damit die neue Seite sofort
  // mit der passenden Richtung erscheint.
  const stackRef = useRef([location.pathname]);
  const lastPathRef = useRef(location.pathname);
  const directionRef = useRef(1);

  if (lastPathRef.current !== location.pathname) {
    const stack = stackRef.current;
    if (stack[stack.length - 2] === location.pathname) {
      stack.pop();
      directionRef.current = -1;
    } else {
      stack.push(location.pathname);
      if (stack.length > 50) stack.shift();
      directionRef.current = 1;
    }
    lastPathRef.current = location.pathname;
  }

  // Nach Seitenwechsel nach oben scrollen.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Nur Einblenden, kein Ausblenden: Die alte Seite verschwindet sofort.
  // So kann keine laufende Animation Knöpfe blockieren oder hängen bleiben.
  return (
    <div className="flex flex-col min-h-screen">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: directionRef.current > 0 ? SLIDE : -SLIDE }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.12,
          ease: [0.32, 0.72, 0, 1],
        }}
        className={`flex-1 ${showTabBar ? "pb-tabbar" : ""}`}
      >
        <Outlet />
      </motion.div>

      {showTabBar && <BottomTabBar />}
    </div>
  );
}
