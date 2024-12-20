import { useEffect, useState } from "react";
import Header from "./Header";
import Chat from "./Chat";
import Conversations from "./Conversations";
import { conversationsExample } from "@utils/lists";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation } from "@utils/interfaces";

interface ChatPreviewProps {
  config: ConfigWebChat;
}

const ChatPreview = ({ config }: ChatPreviewProps) => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  useEffect(() => {
    setConversations(conversationsExample);
  }, []);

  return (
    <div
      className="w-[350px] h-[560px] flex flex-col overflow-hidden font-sans"
      style={{
        color: config.text_color,
        backgroundColor: config.bg_chat,
        borderTopLeftRadius: `${config.edge_radius}px`,
        borderTopRightRadius: `${config.edge_radius}px`,
      }}
    >
      <Header
        conversation={conversation}
        config={config}
        setConversation={setConversation}
      />
      {conversation ? (
        <Chat config={config} conversation={conversation} />
      ) : (
        <Conversations
          conversations={conversations}
          config={config}
          setConversation={setConversation}
        />
      )}
    </div>
  );
};

export default ChatPreview;
