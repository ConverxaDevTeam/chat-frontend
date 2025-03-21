import { getConversationsByOrganizationId } from "@services/conversations";
import { useEffect, useState } from "react";
import ConversationCard from "./ConversationCard";
import { RiArrowUpDownFill } from "react-icons/ri";
import { ConversationListItem } from "@interfaces/conversation";
import { useAppSelector } from "@store/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Conversations = () => {
  const navigate = useNavigate();
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

  const handleViewAllChats = () => {
    if (conversations.length > 0) {
      navigate(`/conversation/detail/${conversations[0].id}`);
    } else {
      toast.info("No hay conversaciones disponibles");
    }
  };

  return (
    <div className="w-full flex flex-col">
      <button
        type="button"
        className="bg-sofia-electricOlive rounded-[8px] w-[161px] h-[34px] mb-[10px]"
        onClick={handleViewAllChats}
      >
        <p className="text-[14px] text-sofia-superDark">Ver todos los chats</p>
      </button>
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-[900px] border-spacing-0 mb-[16px]">
          <div className="h-[36px] text-[16px] flex">
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center pl-[16px]">
                <p>Usuario</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p>ID</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Departamento</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Estatus</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="hidden md:table-cell w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Iniciado</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*5)]">
              <div className="flex gap-[10px] items-center">
                <p>Último mensaje</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p>Canal</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*4)]">
              <div className="flex gap-[10px] items-center">
                <p>Asistencia humana</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
          </div>
          <div className="bg-custom-gradient rounded-[8px] border-[2px] border-[#B8CCE0] border-inherit bg-app-c2">
            {conversations.map(conversation => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onUpdateConversation={handleUpdateConversation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
