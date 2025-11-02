import React, { useState } from "react";
import { X } from "lucide-react";

export const NewChatPanel = ({ onSelectUser, onCancel }) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!recipient.trim()) return alert("Please enter a recipient.");
    if (!message.trim()) return alert("Please type a message.");

    // ✅ Simulate creating a new chat with the entered recipient
    const newChat = {
      id: Date.now(),
      name: recipient,
      lastMessage: message,
      messages: [
        { sender: "You", text: message, timestamp: new Date().toISOString() },
      ],
    };
    onSelectUser && onSelectUser(newChat);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0B0B] text-gray-200 border-l border-[#1f1f1f] relative transition-all duration-300">
      {/* Header input */}
      <div className="border-b border-[#1f1f1f] p-4 flex items-center gap-2">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="To: Enter name, email or phone number"
          className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
        />
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition"
            title="Cancel new chat"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Center section */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-4 select-none">
        <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#202020] to-[#111111] flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d6d6d6"
            strokeWidth="1.4"
            className="w-14 h-14"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-100">
            You’re starting a new conversation
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Type your first message below.
          </p>
        </div>
      </div>

      {/* Message input */}
      <div className="border-t border-[#1f1f1f] p-4 flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-[#1a1a1a] text-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#3a3a3a]"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#4444ff] hover:bg-[#5656ff] text-white px-3 py-2 rounded-lg transition text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};
