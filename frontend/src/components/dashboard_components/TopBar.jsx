import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  MoreHorizontal,
  Settings,
  HelpCircle,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TopBar = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (menuRef.current && menuRef.current.contains(e.target)) ||
        (profileRef.current && profileRef.current.contains(e.target))
      )
        return;
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <header className="h-14 bg-[#0f0f0f] border-b border-[#1f1f1f] grid grid-cols-3 items-center px-4 relative">
      {/* Left section */}
      <div className="flex items-center justify-start gap-3">
        <button
          className="md:hidden p-2 hover:bg-[#1a1a1a] rounded-lg"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-[#b3b3b3]" />
        </button>
      </div>

      {/* Center search */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-10 py-2 text-sm text-white placeholder:text-[#8f8f8f] focus:outline-none focus:ring-1 focus:ring-[#8B8BFF]"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-end gap-3 relative">
        <div className="w-2 h-2 bg-[#8B8BFF] rounded-full"></div>

        {/* 3-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 hover:bg-[#1a1a1a] rounded-lg"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
            }}
          >
            <MoreHorizontal className="w-5 h-5 text-[#b3b3b3]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-10 w-56 bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg shadow-lg z-50 animate-fadeIn">
              {/* Premium section */}
              <div className="flex items-center gap-2 px-4 py-3 hover:bg-[#2a2a2a] cursor-pointer rounded-t-lg">
                <span
                  className="text-[#a68eff]"
                  dangerouslySetInnerHTML={{
                    __html: `<svg fill="currentColor" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 2.75a.75.75 0 0 0-.66.39l-2.75 5c-.15.27-.11.6.08.84l7.25 8.75a.75.75 0 0 0 1.16 0l7.25-8.75c.2-.24.23-.57.08-.84l-2.75-5a.75.75 0 0 0-.66-.39h-9ZM4.16 7.5l1.78-3.25h1.5L6.31 7.5H4.16ZM6.14 9l1.93 4.75L4.14 9h2ZM10 14.48 7.76 9h4.39l-2.16 5.48ZM7.89 7.5l1.14-3.25h1.95l1.2 3.25H7.88Zm5.88 0-1.2-3.25h1.49l1.78 3.25h-2.07Zm0 1.5h2.1l-4.01 4.83L13.76 9Z"></path></svg>`,
                  }}
                />
                <span className="text-sm text-gray-200">Upgrade</span>
              </div>

              <div className="border-t border-[#2a2a2a]" />

              {/* Menu options */}
              <ul className="py-2 text-sm text-gray-300">
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  <Settings size={16} />
                  Settings
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  <HelpCircle size={16} />
                  Help
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  <MessageSquare size={16} />
                  Feedback
                </li>
              </ul>

              <div className="border-t border-[#2a2a2a]" />

              {/* Footer options */}
              <ul className="py-2 text-sm text-gray-300">
                <li className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  Keyboard shortcuts
                </li>
                <li className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  Get the desktop app
                </li>
                <li className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  Get the mobile app
                </li>
                <li className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer rounded-b-lg">
                  Teams Insider program
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile bubble & dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsMenuOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-[#1f1f1f] flex items-center justify-center text-sm font-semibold text-white border border-[#2a2a2a] cursor-pointer"
          >
            MK
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg w-64 p-4 text-sm z-50 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-white">Personal</span>
                <button
                  onClick={handleLogout}
                  className="text-[#8B8BFF] text-xs hover:underline"
                >
                  Sign out
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#292929] flex items-center justify-center text-white font-semibold text-sm">
                  MK
                </div>
                <div>
                  <p className="text-white font-medium">Kartik Dixit</p>
                  <p className="text-[#9f9f9f] text-xs">kartik@example.com</p>
                  <p className="text-[#8B8BFF] text-xs mt-0.5 cursor-pointer">
                    My Microsoft account ↗
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-white mb-2 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-lg">
                <CheckCircle className="text-green-500 w-4 h-4" />
                <span>Available</span>
              </div>

              <div className="flex items-center justify-between text-sm text-[#b3b3b3] cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-lg">
                <span>Set status message</span>
                <span>›</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
