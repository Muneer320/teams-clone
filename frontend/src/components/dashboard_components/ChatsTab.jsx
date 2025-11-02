import React, { useState } from "react";
import { ChatsCollection } from "./ChatsCollection";
import { ChatArea } from "./ChatArea";

export default function ChatsTab() {
  const [activeChat, setActiveChat] = useState(null);

  const chats = [
    {
      id: 1,
      name: "Hriday K.S.",
      lastMessage: "You: hihi",
      time: "9:50 AM",
    },
    {
      id: 2,
      name: "Random Title",
      lastMessage: "Muneer: New event created: Random Title",
      time: "9:32 AM",
    },
    {
      id: 3,
      name: "Muneer Alam",
      lastMessage: "jyfhvjtfytj",
      time: "11/1",
    },
  ];

  return (
    <div className="flex h-[92.5vh] bg-[#0A0A0A] text-white overflow-hidden p-2">
      {/* Left side — chats list */}
      <ChatsCollection
        chats={chats}
        onSelectChat={setActiveChat}
        activeChatId={activeChat}
      />

      {/* Right side — chat area */}
      <div className="flex-1">
        <ChatArea />
      </div>
    </div>
  );
}
