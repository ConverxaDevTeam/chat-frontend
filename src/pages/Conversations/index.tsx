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
  user_deleted: boolean;
  messages: Message[];
}

const Conversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const fetchConversations = async () => {
    const response = await getConversationsByOrganizationId(1);
    setConversations(response);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div>
      <p>Conversations</p>
      <table className="w-full border-spacing-0">
        <thead className="border-b-[1px]">
          <tr className="h-[60px] text-[16px]">
            <th className="w-[calc(100%/17)]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-[16px] 2xl:w-[20px] h-[16px] 2xl:h-[20px] mr-[20px] 2xl:mr-[30px]"
                  checked={isChecked}
                  onChange={handleCheckBoxChange}
                />
              </div>
            </th>
            <th className="w-[calc(100%/17*2)]">
              <div className="flex gap-[10px] items-center">
                <p>ID</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/17*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Status</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/17*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Iniciado</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/17*7)]">
              <div className="flex gap-[10px] items-center">
                <p>Ultimo mensaje</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
            <th className="w-[calc(100%/17*3)]">
              <div className="flex gap-[10px] items-center">
                <p>Plataforma</p>
                <RiArrowUpDownFill className="text-[#212121] cursor-pointer" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {conversations.map(conversation => {
            return (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                checkAll={isChecked}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Conversations;
