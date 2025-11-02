import React from "react";
// Using the path you provided
import { cn } from "../../lib/utils";

export const MeetingActionCard = ({
  icon: Icon,
  title,
  variant = "secondary",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-6 py-4 rounded-lg transition-all hover:scale-105",
        variant === "primary"
          ? // Using placeholder primary colors, adjust as needed
            "bg-[#4F52B2] text-white hover:bg-[#4F52B2]"
          : // Updated secondary variant to match the image
            "bg-[#1f1f1f] text-gray-200 border border-[#2a2a2a] hover:bg-[#242424]"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{title}</span>
    </button>
  );
};
