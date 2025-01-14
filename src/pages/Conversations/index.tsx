import { getConversationsByOrganizationId } from "@services/conversations";
import { useEffect, useState } from "react";
import ConversationCard from "./ConversationCard";
import { RiArrowUpDownFill } from "react-icons/ri";
import { ConversationListItem } from "@interfaces/conversation";
import { useAppSelector } from "@store/hooks";

const Conversations = () => {
  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );
  if (!organizationId) throw new Error("Organization ID not found");
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    []
  );

  const fetchConversations = async () => {
    const response = await getConversationsByOrganizationId(organizationId);
    setConversations(response);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleUpdateConversation = (
    updatedConversation: ConversationListItem
  ) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
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
              onUpdateConversation={handleUpdateConversation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Conversations;
