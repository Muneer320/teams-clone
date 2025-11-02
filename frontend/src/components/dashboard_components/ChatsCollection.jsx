import React, { useState } from "react";
import { ChevronDown, UserPlus2 } from "lucide-react";

export const ChatsCollection = ({ chats, onSelectChat, activeChatId }) => {
  const [selectedCategory, setSelectedCategory] = useState("Recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["Recent", "Pinned", "Archived", "Hidden"];

  return (
    <div className="w-[28rem] h-full bg-[#0A0A0A] flex flex-col text-gray-200">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex items-center space-x-3">
          {[
            `<path d='M7.5 13h5a.5.5 0 0 1 .09 1H7.5a.5.5 0 0 1-.09-1h5.09-5Zm-2-4h9a.5.5 0 0 1 .09 1H5.5a.5.5 0 0 1-.09-1h9.09-9Zm-2-4h13a.5.5 0 0 1 .09 1H3.5a.5.5 0 0 1-.09-1H16.5h-13Z'/>`,
            `<path d='M5 4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3v-.32l3.04 2.1c.83.57 1.96-.03 1.96-1.03v-7.5c0-1-1.13-1.6-1.96-1.03L13 7.32V7a3 3 0 0 0-3-3H5Zm8 4.54 3.6-2.5c.17-.1.4.01.4.21v7.5c0 .2-.23.32-.4.2L13 11.46V8.54ZM3 7c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z'/>`,
            `<path d='M17.85 2.85a.5.5 0 0 0-.7-.7l-8 8L9 11l.85-.15 8-8ZM5.5 3A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5v-6a.5.5 0 0 0-1 0v6c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5v-9C4 4.67 4.67 4 5.5 4h6a.5.5 0 0 0 0-1h-6Z'/>`,
          ].map((path, i) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2a2a2a] hover:bg-[#252525] hover:border-[#383838] transition-colors cursor-pointer"
              dangerouslySetInnerHTML={{
                __html: `<svg fill="currentColor" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">${path}</svg>`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 🔹 Dropdown */}
      <div className="relative px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-1 group"
        >
          <ChevronDown
            className={`w-3 h-3 text-gray-400 group-hover:text-gray-200 transition-all ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
          <span className="group-hover:text-gray-200">{selectedCategory}</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-8 left-5 w-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg z-10 overflow-hidden animate-fadeIn">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#252525] text-gray-100 font-medium"
                    : "text-gray-300 hover:bg-[#252525]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Chats */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-none">
        {chats.map((chat) => {
          const isActive = activeChatId === chat.id;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                isActive ? "bg-[#1F1F1F]" : "hover:bg-[#1a1a1a]"
              }`}
            >
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold mr-3"
                style={{ backgroundColor: "#FBDED8" }}
              >
                {chat.avatar || chat.name.charAt(0)}
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4
                    className={`truncate font-medium ${
                      isActive ? "text-gray-100 font-semibold" : "text-gray-200"
                    }`}
                  >
                    {chat.name}
                  </h4>
                  <span
                    className={`text-xs ml-2 ${
                      isActive ? "text-gray-100 font-semibold" : "text-gray-400"
                    }`}
                  >
                    {chat.time}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    isActive ? "text-gray-200 font-medium" : "text-gray-400"
                  }`}
                >
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          );
        })}

        {chats.length === 0 && (
          <div className="text-gray-500 text-center mt-10 text-sm">
            No chats found
          </div>
        )}
      </div>

      {/* 🔹 Footer (Invite to Teams) */}
      <div className="p-3 text-center bg-[#0A0A0A]">
        <button className="flex items-center justify-center border w-full bg-[#292929] hover:bg-[#252525] text-gray-300 rounded-xl px-3 py-2 transition-colors text-sm font-medium">
          <UserPlus2 className="w-4 h-4 mr-2" />
          Invite to Teams
        </button>
      </div>
    </div>
  );
};
