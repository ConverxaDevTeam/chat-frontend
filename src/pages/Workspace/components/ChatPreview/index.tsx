import { useEffect, useState } from "react";
import Header from "./Header";
import Chat from "./Chat";
import Conversations from "./Conversations";
import { conversationsExample } from "@utils/lists";
import { ConfigWebChat } from "../CustomizeChat";

interface ChatPreviewProps {
  config: ConfigWebChat;
}

export interface IConversation {
  id: number;
  messages: IMessage[];
  created_at: string;
}

export interface IMessage {
  id: number;
  text: string;
  type: "agent" | "user";
  created_at: string;
}

const ChatPreview = ({ config }: ChatPreviewProps) => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  useEffect(() => {
    setConversations(conversationsExample);
  }, []);

  return (
    <div
      className="w-[350px] h-[500px] flex flex-col overflow-hidden font-sans"
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
