import React from "react";

export const AVATARS = [
  "🥶",
  "🤪",
  "😎",
  "🥳",
  "🤡",
  "👻",
  "🤠",
  "🥂",
  "🦄",
  "🎉",
  "🔥",
  "😍",
  "🤯",
  "😈",
  "💀",
];

export default function AvatarPicker({
  selected,
  onSelect,
  disabledAvatars = [],
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {AVATARS.map((avatar) => {
        const isDisabled =
          disabledAvatars.includes(
            avatar
          ) &&
          avatar !== selected;

        return (
          <button
            key={avatar}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                onSelect(
                  avatar
                );
              }
            }}
            className={`text-2xl w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              selected === avatar
                ? "bg-primary/30 border-2 border-primary scale-110 shadow-md shadow-primary/20"
                : isDisabled
                  ? "bg-secondary/30 border-2 border-transparent opacity-30 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary/60 border-2 border-transparent"
            }`}
          >
            {avatar}
          </button>
        );
      })}
    </div>
  );
}