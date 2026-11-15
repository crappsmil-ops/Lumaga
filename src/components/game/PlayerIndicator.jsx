import React from "react";
import { motion } from "framer-motion";

function PlayerIndicator({ currentPlayer }) {
  const name =
    typeof currentPlayer === "object"
      ? currentPlayer.name
      : currentPlayer;

  const avatar =
    typeof currentPlayer === "object"
      ? currentPlayer.avatar
      : null;

  return (
    <motion.div
      key={name}
      initial={{
        opacity: 0,
        scale: 0.85,
        y: -16,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="flex flex-col items-center mb-6"
    >
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
        Jetzt dran
      </p>

      <div className="relative mb-3">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-40"
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
          {avatar ? (
            <span className="text-3xl">
              {avatar}
            </span>
          ) : (
            <span className="text-2xl font-heading font-black text-white">
              {name?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>
      </div>

      <div className="inline-flex items-center bg-card border border-primary/30 rounded-2xl px-5 py-2 shadow-md shadow-primary/10">
        <span className="text-lg font-heading font-bold">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

export default React.memo(PlayerIndicator);