import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  MoreHorizontal,
  Settings,
  HelpCircle,
  MessageSquare,
  CheckCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../../config/api";

const API_URL = API_CONFIG.USER;

export const TopBar = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target) ||
        profileRef.current?.contains(e.target)
      )
        return;
      setShowResults(false);
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Real-time search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const res = await fetch(
          `${API_URL}/search?query=${encodeURIComponent(searchTerm)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (data.success) setSearchResults(data.users);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleAddFriend = async (friendEmail) => {
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email"); // or from context
      const res = await fetch(`${API_URL}/add-friend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: userEmail,
          friend_email: friendEmail,
        }),
      });

      const data = await res.json();
      console.log(data.message || data.error);
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };

  const handleLogout = () => navigate("/logout");

  return (
    <header className="h-14 bg-[#0A0A0A] grid grid-cols-3 items-center px-4 relative">
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
      <div className="flex justify-center" ref={searchRef}>
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-10 py-2 text-sm text-white placeholder:text-[#8f8f8f] focus:outline-none focus:ring-1 focus:ring-[#8B8BFF]"
          />

          {/* Search dropdown */}
          {showResults && (
            <div className="absolute mt-2 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg z-50 overflow-y-auto max-h-80 animate-fadeIn">
              {loading ? (
                <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#292929] flex items-center justify-center text-xs font-medium text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user.email)}
                      className="p-1.5 hover:bg-[#3a3a3a] rounded-md transition"
                    >
                      <UserPlus className="w-4 h-4 text-[#8B8BFF]" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-3 text-center text-gray-500 text-sm">
                  No users found
                </div>
              )}
            </div>
          )}
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
              <ul className="py-2 text-sm text-gray-300">
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  <Settings size={16} /> Settings
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  <HelpCircle size={16} /> Help
                </li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer">
                  <MessageSquare size={16} /> Feedback
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
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
