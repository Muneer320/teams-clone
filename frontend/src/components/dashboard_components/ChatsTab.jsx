import React, { useState } from "react";
import { ChatsCollection } from "./ChatsCollection";
import { ChatArea } from "./ChatArea";

const ChatsTab = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      <ChatsCollection
        userId={userId}
        activeChatId={selectedChat?.id}
        onSelectChat={(chat) => setSelectedChat(chat)}
      />
      <ChatArea selectedChat={selectedChat} />
    </div>
  );
};

export default ChatsTab;
