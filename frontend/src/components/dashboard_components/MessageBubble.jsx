import React from "react";
import { Check, Eye } from "lucide-react";

export const MessageBubble = ({ message, direction = "left", sender, time, read }) => {
  const isRight = direction === "right";

  return (
    <div className={`flex flex-col ${isRight ? "items-end" : "items-start"}`}>
      <div className={`flex items-end ${isRight ? "flex-row-reverse" : ""}`}>
        {/* Avatar for left messages */}
        {!isRight && (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-black font-semibold mr-2 shrink-0"
            style={{ backgroundColor: "#FBDED8" }}
          >
            {sender ? sender.charAt(0).toUpperCase() : "?"}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`max-w-[70%] break-words whitespace-pre-wrap px-4 py-2 rounded-2xl text-sm leading-snug
          ${isRight
            ? "bg-[#4F46E5] text-white rounded-br-none"
            : "bg-[#1F1F1F] text-gray-200 rounded-bl-none"
          }`}
        >
          {message}
        </div>
      </div>

      {/* Timestamp and read indicator */}
      <div
        className={`text-xs text-gray-500 mt-1 flex items-center space-x-1 ${
          isRight ? "justify-end pr-2" : "ml-12"
        }`}
      >
        <span>{time}</span>
        {isRight &&
          (read ? (
            <Eye className="w-3 h-3 text-gray-400" />
          ) : (
            <Check className="w-3 h-3 text-gray-400" />
          ))}
      </div>
    </div>
  );
};
