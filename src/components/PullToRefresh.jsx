import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 70;
const RESISTANCE = 0.5;

export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const tracking = useRef(false);

  const canStart = useCallback(
    (target) => {
      if (refreshing) return false;
      let el = target;
      while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        const scrollable = style.overflowY === "auto" || style.overflowY === "scroll";
        if (scrollable && el.scrollTop > 0) return false;
        el = el.parentElement;
      }
      return window.scrollY <= 0;
    },
    [refreshing]
  );

  const onTouchStart = useCallback(
    (e) => {
      if (!canStart(e.target)) return;
      startY.current = e.touches[0].clientY;
    },
    [canStart]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        if (tracking.current) {
          tracking.current = false;
          setPull(0);
        }
        return;
      }
      if (window.scrollY <= 0) {
        tracking.current = true;
        setPull(Math.min(delta * RESISTANCE, 100));
      }
    },
    []
  );

  const onTouchEnd = useCallback(async () => {
    if (tracking.current && pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else if (!refreshing) {
      setPull(0);
    }
    tracking.current = false;
    startY.current = null;
  }, [pull, refreshing, onRefresh]);

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <>
      <AnimatePresence>
        {(pull > 0 || refreshing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
              <RefreshCw
                className={`w-4 h-4 text-primary ${refreshing ? "animate-spin" : ""}`}
                style={{ transform: `rotate(${pull * 3}deg)` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        style={{
          transform: pull > 0 ? `translateY(${pull}px)` : undefined,
          transition: tracking.current ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}