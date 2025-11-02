import React, { useState, useEffect } from "react";
import { ChevronDown, UserPlus2 } from "lucide-react";
import API_CONFIG from "../../config/api"; // ✅ use your API config

export const ChatsCollection = ({ onSelectChat, activeChatId }) => {
  const [chats, setChats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ["Recent", "Pinned", "Archived", "Hidden"];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        if (!userEmail || !token) {
          console.error("❌ Missing user email or token in localStorage");
          return;
        }

        console.log(`${API_CONFIG.USER}/contacts/${userEmail}`)
        console.log(token)

        const res = await fetch(`${API_CONFIG.USER}/contacts/${userEmail}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.success) {
            console.log(data);
          // 🔄 Adapt contacts to chat format
          const formatted = data.contacts.map((c) => ({
            id: c.id,
            name: c.name || c.nickname,
            email: c.email,
            lastMessage: c.last_message || "Start a chat...",
            time: c.added_on ? new Date(c.added_on).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
          }));
          setChats(formatted);
        } else {
          console.error("❌ Failed to load contacts:", data.error);
        }
      } catch (err) {
        console.error("❌ Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="w-[28rem] h-full bg-[#0A0A0A] flex flex-col text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex items-center space-x-3">
          {[
            `<path d='M7.5 13h5a.5.5 0 0 1 .09 1H7.5a.5.5 0 0 1-.09-1h5.09-5Z'/>`,
            `<path d='M5 4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3v-.32l3.04 2.1c.83.57 1.96-.03 1.96-1.03v-7.5c0-1-1.13-1.6-1.96-1.03L13 7.32V7a3 3 0 0 0-3-3H5Z'/>`,
            `<path d='M17.85 2.85a.5.5 0 0 0-.7-.7l-8 8L9 11l.85-.15 8-8Z'/>`,
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

      {/* Dropdown */}
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

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-none">
        {loading ? (
          <div className="text-gray-500 text-center mt-10 text-sm">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="text-gray-500 text-center mt-10 text-sm">No chats found</div>
        ) : (
          chats.map((chat) => {
            const isActive = activeChatId === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive ? "bg-[#1F1F1F]" : "hover:bg-[#1a1a1a]"
                }`}
              >
                <div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold mr-3"
                  style={{ backgroundColor: "#FBDED8" }}
                >
                  {chat.name.charAt(0).toUpperCase()}
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
          })
        )}
      </div>

      <div className="p-3 text-center bg-[#0A0A0A]">
        <button className="flex items-center justify-center border w-full bg-[#292929] hover:bg-[#252525] text-gray-300 rounded-xl px-3 py-2 transition-colors text-sm font-medium">
          <UserPlus2 className="w-4 h-4 mr-2" />
          Invite to Teams
        </button>
      </div>
    </div>
  );
};
