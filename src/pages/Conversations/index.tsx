import { getConversationsByOrganizationId } from "@services/conversations";
import { useEffect, useState } from "react";
import ConversationCard from "./ConversationCard";
import { RiArrowUpDownFill } from "react-icons/ri";

export enum ConversationType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export enum MessageType {
  USER = "user",
  AGENT = "agent",
}

export interface Message {
  id: number;
  created_at: string;
  updated_at: string;
  text: string;
  type: MessageType;
}

export interface Conversation {
  id: number;
  created_at: string;
  updated_at: string;
  type: ConversationType;
  userId: number;
  user_deleted: boolean;
  messages: Message[];
}

const Conversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    const response = await getConversationsByOrganizationId(1);
    setConversations(response);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleTakeChat = async (conversationId: number) => {
    // TODO: Implement backend integration for taking over the chat
    console.log(`Taking over chat ${conversationId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Conversations</h1>
      </div>
      <table className="w-full border-spacing-0">
        <thead className="border-b-[1px]">
          <tr className="h-[60px] text-[16px]">
            <th className="w-[calc(100%/24*2)]">
              <div className="flex gap-[10px] items-center">
                <p>ID</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/24*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Status</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="hidden md:table-cell w-[calc(100%/24*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Iniciado</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-2">
              <div className="flex gap-[10px] items-center">
                <p>Último mensaje</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/24*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Plataforma</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/24*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Need HITL</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/24*4)]">
              <div className="flex gap-[10px] items-center">
                <p>Actions</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {conversations.map(conversation => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onTakeChat={handleTakeChat}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Conversations;
