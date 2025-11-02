import React, { useState } from "react";
import { ChatsCollection } from "./ChatsCollection";
import { ChatArea } from "./ChatArea";
import { NewChatPanel } from "./NewChatPanel"; // ✅ import it here

const ChatsTab = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChatPanel, setShowNewChatPanel] = useState(false);

  // When "New Chat" button is clicked
  const handleOpenNewChat = () => {
    setShowNewChatPanel(true);
    setSelectedChat(null);
  };

  // When a chat is selected or new chat started
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowNewChatPanel(false);
  };

  // When the user cancels new chat
  const handleCloseNewChatPanel = () => {
    setShowNewChatPanel(false);
  };

  return (
    <div className="flex h-full bg-[#0A0A0A]">
      {/* Sidebar (Chats list) */}
      <ChatsCollection
        userId={userId}
        onSelectChat={handleSelectChat}
        onNewChatClick={handleOpenNewChat} // ✅ call this from ChatsCollection button
        activeChatId={selectedChat?.id}
      />

      {/* Right section — ChatArea or NewChatPanel */}
      <div className="flex-1 bg-[#1E1E1E]">
        {showNewChatPanel ? (
          <NewChatPanel
            onSelectUser={handleSelectChat}
            onCancel={handleCloseNewChatPanel}
          />
        ) : selectedChat ? (
          <ChatArea selectedChat={selectedChat} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select or start a conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsTab;
