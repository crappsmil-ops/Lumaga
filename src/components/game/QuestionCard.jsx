import React from "react";
import { motion } from "framer-motion";

function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
}) {
  return (
    <motion.div
      key={questionIndex}
      initial={{
        opacity: 0,
        scale: 0.9,
        rotateY: -10,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        rotateY: 10,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="w-full"
    >
      <div className="flex justify-end mb-3">
        <span className="text-muted-foreground text-sm font-body">
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 min-h-[200px] flex items-center justify-center shadow-2xl shadow-black/20 select-none">
        <p className="min-w-0 max-w-full text-xl md:text-2xl font-heading font-bold text-center leading-relaxed whitespace-normal break-words [overflow-wrap:anywhere]">
  {question.text}
</p>
      </div>
    </motion.div>
  );
}

export default React.memo(QuestionCard);