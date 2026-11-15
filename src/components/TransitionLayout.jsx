import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomTabBar from "@/components/BottomTabBar";
import { subscribeDisclaimer } from "@/lib/disclaimerState";

const TAB_ROUTES = ["/", "/mydeck", "/settings"];

// Subtle iOS-style push/pop slide distance (px). Kept small so screens look
// identical before/after — only the transition changes.
const SLIDE = 16;

export default function TransitionLayout() {
  const location = useLocation();
  const [disclaimerActive, setDisclaimerActive] = useState(false);

  useEffect(() => {
    return subscribeDisclaimer(setDisclaimerActive);
  }, []);

  const showTabBar =
    TAB_ROUTES.includes(location.pathname) && !disclaimerActive;

  // Detect navigation direction (push forward vs. pop back) using a local
  // route stack so the slide animation can mirror iOS push/pop.
  const stackRef = useRef([location.pathname]);
  const [direction, setDirection] = useState(1); // 1 = push, -1 = pop

  useEffect(() => {
    const stack = stackRef.current;
    const top = stack[stack.length - 1];

    if (location.pathname === top) return;

    const secondFromTop = stack[stack.length - 2];

    if (location.pathname === secondFromTop) {
      stack.pop();
      setDirection(-1);
    } else {
      stack.push(location.pathname);
      setDirection(1);
    }
  }, [location.pathname]);

  // Hardware back-button / popstate handling.
  // React Router already maps popstate to in-app back navigation. This handler
  // ensures the scroll position resets to top on back navigation (a common
  // mobile issue) and, when the user lands on a tab root via back, pushes a
  // single history buffer entry so one accidental back press does not exit the
  // app immediately. The buffer is only pushed once per root visit, so the user
  // can still exit with a second press.
  useEffect(() => {
    let buffered = false;

    const pushBuffer = () => {
      if (
        !buffered &&
        TAB_ROUTES.includes(window.location.pathname)
      ) {
        window.history.pushState(
          { trinklumaBuffer: true },
          "",
          window.location.pathname
        );
        buffered = true;
      }
    };

    pushBuffer();

    const onPopState = () => {
      // Reset scroll on any back/forward navigation
      window.scrollTo(0, 0);

      // Re-arm the buffer for the current root so a single back doesn't exit
      buffered = false;
      pushBuffer();
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={{
            enter: (dir) => ({
              opacity: 0,
              x: dir > 0 ? SLIDE : -SLIDE,
            }),
            center: {
              opacity: 1,
              x: 0,
            },
            exit: (dir) => ({
              opacity: 0,
              x: dir > 0 ? -SLIDE : SLIDE,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.12,
            ease: [0.32, 0.72, 0, 1],
          }}
          className={`flex-1 ${showTabBar ? "pb-tabbar" : ""}`}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {showTabBar && <BottomTabBar />}
    </div>
  );
}