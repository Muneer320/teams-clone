import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import {
  Video,
  Phone,
  Users,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Image,
  Plus,
  Search,
} from "lucide-react";

export const ChatArea = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Muneer Alam",
      text: "Hello",
      direction: "left",
      time: "Today 11:50 AM",
      read: true,
    },
    {
      id: 2,
      sender: "Muneer Alam",
      text: "What are you doing?",
      direction: "left",
      time: "Today 11:51 AM",
      read: false,
    },
    {
      id: 3,
      sender: "You",
      text: "Just working on the project!",
      direction: "right",
      time: "Today 11:52 AM",
      read: true,
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: input.trim(),
      direction: "right",
      time: "Now",
      read: false,
    };
    setMessages((m) => [...m, newMsg]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col flex-1 rounded-2xl border border-[#2a2a2a] overflow-hidden bg-[#292929]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#292929] border-b border-[#2a2a2a]">
        {/* Left section: avatar + name + tabs */}
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold"
            style={{ backgroundColor: "#FBDED8" }}
          >
            M
          </div>

          {/* Name and tabs inline */}
          <div className="flex items-center space-x-6">
            <h2 className="text-white font-semibold text-base">Muneer Alam</h2>

            {/* Tabs */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="text-indigo-400 border-b-2 border-indigo-400 pb-[2px] cursor-pointer">
                Chat
              </span>
              <span className="hover:text-white cursor-pointer">Files</span>
              <span className="hover:text-white cursor-pointer">Photos</span>
            </div>
          </div>
        </div>

        {/* Right section: icons */}
        <div className="flex items-center space-x-4 text-gray-300">
          <Video className="w-5 h-5 text-[#5B5FC7] hover:text-[#6c70e5] cursor-pointer" />
          <Phone className="w-5 h-5 text-[#5B5FC7] hover:text-[#6c70e5] cursor-pointer" />
          <Search className="w-5 h-5 hover:text-white cursor-pointer" />
          <Users className="w-5 h-5 hover:text-white cursor-pointer" />
          <MoreVertical className="w-5 h-5 hover:text-white cursor-pointer" />
        </div>
      </div>
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-end bg-[#292929]"
      >
        <div className="flex flex-col space-y-3">
          {messages.map((msg) => (
            <div key={msg.id}>
              <MessageBubble
                message={msg.text}
                direction={msg.direction}
                sender={msg.sender}
                time={msg.time}
                read={msg.read}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center px-4 py-3 bg-[#292929] border-t border-[#2a2a2a]">
        <Plus className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer mr-3" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-[#2f2f2f] text-gray-200 text-sm px-4 py-2 rounded-lg outline-none placeholder-gray-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <div className="flex items-center space-x-3 ml-3">
          <Image className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Paperclip className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Smile className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <button
            onClick={sendMessage}
            className="bg-[#5B5FC7] hover:bg-[#4f54c3] text-white p-2 rounded-lg flex items-center justify-center transition"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
