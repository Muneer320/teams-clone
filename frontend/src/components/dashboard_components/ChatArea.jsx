import React, { useState, useRef, useEffect, useCallback } from "react";
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
import API_CONFIG from "../../config/api";

export const ChatArea = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // helper: current user
  const currentUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);
  const currentUserEmail = localStorage.getItem("email") || null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      // small delay to allow new element to render
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // fetchMessages function (useCallback so sendMessage can reuse)
  const fetchMessages = useCallback(async () => {
    if (!selectedChat || !currentUserEmail || !token) return;

    setLoading(true);
    try {
      // Use email-based route
      const res = await fetch(
        `${API_CONFIG.CHAT}/${encodeURIComponent(currentUserEmail)}/${encodeURIComponent(
          selectedChat.email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      // Your messages route returns { success: true, messages: [...] }
      // or might return an array — handle both
      const msgs = Array.isArray(data) ? data : data.messages || [];
      setMessages(msgs);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, currentUserEmail, token]);

  // Fetch when selectedChat changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat, fetchMessages]);

  // sendMessage - posts to backend and refreshes messages
  const sendMessage = async () => {
    if (!input.trim()) return;
    console.log(currentUserEmail)
    console.log(token)
    console.log(selectedChat)
    if (!currentUserEmail || !selectedChat || !token) {
      console.warn("Missing user / chat / token");
      return;
    }

    const text = input.trim();

    // build optimistic message in same shape backend returns
    const optimisticMsg = {
      id: `temp-${Date.now()}`, // temporary id until server returns real id
      sender_email: currentUserEmail,
      receiver_email: selectedChat.email,
      message: text,
      timestamp: new Date().toISOString(),
      is_read: 0,
    };

    // show immediately
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    try {
      const res = await fetch(`${API_CONFIG.CHAT}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_email: currentUserEmail,
          receiver_email: selectedChat.email,
          message: text,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        console.warn("Message not saved on server:", data);
        // Optionally remove optimistic message or mark failed
        // For now: refetch to sync state
        await fetchMessages();
        return;
      }

      // server saved it — refresh conversation to pick up real id/timestamp/is_read
      await fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      // attempt to refetch to correct UI
      await fetchMessages();
    }
  };

  if (!selectedChat)
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500 bg-[#292929]">
        Select a chat to start messaging
      </div>
    );

  return (
    <div className="flex h-full flex-col flex-1 rounded-2xl border border-[#2a2a2a] overflow-hidden bg-[#292929]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#292929] border-b border-[#2a2a2a]">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold"
            style={{ backgroundColor: "#FBDED8" }}
          >
            {selectedChat.name?.charAt(0) || "?"}
          </div>
          <div className="flex items-center space-x-6">
            <h2 className="text-white font-semibold text-base">{selectedChat.name}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-300">
          <Video className="w-5 h-5 text-[#5B5FC7] hover:text-[#6c70e5] cursor-pointer" />
          <Phone className="w-5 h-5 text-[#5B5FC7] hover:text-[#6c70e5] cursor-pointer" />
          <Search className="w-5 h-5 hover:text-white cursor-pointer" />
          <Users className="w-5 h-5 hover:text-white cursor-pointer" />
          <MoreVertical className="w-5 h-5 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-end bg-[#292929]">
        <div className="flex flex-col space-y-3">
          {loading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : (
            messages.map((msg) => {
              const senderEmail = msg.sender_email || msg.sender || msg.senderId || msg.sender_id;
              const isRight = senderEmail === currentUserEmail;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg.message || msg.text}
                  direction={isRight ? "right" : "left"}
                  sender={isRight ? "You" : selectedChat.name}
                  time={msg.timestamp || msg.time}
                  read={msg.is_read === 1 || msg.read === true}
                />
              );
            })
          )}
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
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
