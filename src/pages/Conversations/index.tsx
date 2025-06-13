import { getConversationsByOrganizationId } from "@services/conversations";
import { useEffect, useState } from "react";
import ConversationCard from "./ConversationCard";
import { RiArrowUpDownFill } from "react-icons/ri";
import { ConversationListItem } from "@interfaces/conversation";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonExportAllConversations from "./ButtonExportAllConversations";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import { updateConversationCount } from "@store/reducers/auth";

const Conversations = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
    
    dispatch(updateConversationCount({
      organizationId: organizationId,
      count: response.length
    }));
    
    await dispatch(getMyOrganizationsAsync());
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
      <div className="flex gap-4 mb-5">
        <button
          type="button"
          className="bg-sofia-electricGreen flex items-center justify-center rounded-[4px] w-[145px] h-[30px] p-2"
          onClick={handleViewAllChats}
        >
          <p className="text-[14px] font-medium text-sofia-superDark">
            Ver todos los chats
          </p>
        </button>
        <ButtonExportAllConversations conversations={conversations} />
      </div>
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-[900px] border-spacing-0 mb-[16px]">
          <div className="h-[36px] text-[14px] md:text-[16px] flex w-full">
            <div className="pl-[16px] w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-normal break-words">Usuario</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-normal break-words">ID</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-normal break-words">Departamento</p>
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-normal break-words">Estatus</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="hidden md:block w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-normal break-words">Iniciado</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*5)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-normal break-words">Último mensaje</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*2)]">
              <div className="flex gap-[10px] items-center justify-center">
                <p className="whitespace-normal break-words">Canal</p>
                <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark" />
              </div>
            </div>
            <div className="w-[calc(100%/19*3)]">
              <div className="flex gap-[10px] items-center">
                <p className="whitespace-nowrap break-words" title="Asistencia humana">
                  <span className="hidden md:block">Asistencia humana</span>
                </p>

              </div>
            </div>
            <div className="w-[calc(100%/19*1)]">
              <div className="flex justify-center items-center pr-[16px]">
                <p>Acciones</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[4px] border border-app-lightGray border-inherit">
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
