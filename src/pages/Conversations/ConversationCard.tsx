import { convertISOToReadable } from "@utils/format";
import { assignConversationToHitl } from "@services/conversations";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MessageType, ConversationListItem } from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import ButtonExportConversation from "./ButtonExportConversation";

interface MessagePreviewProps {
  type: MessageType;
  text: string;
}

const MessagePreview = ({ type, text }: MessagePreviewProps) => (
  <span className="font-poppinsRegular text-[#212121] py-[8px]">
    <span
      className={`font-medium ${type === MessageType.AGENT ? "text-blue-600" : "text-gray-600"}`}
    >
      {type === MessageType.AGENT ? "Agente" : "Usuario"}:
    </span>{" "}
    {text}
  </span>
);

interface HitlButtonProps {
  conversation: ConversationListItem;
  onUpdateConversation: (conversation: ConversationListItem) => void;
}

const HitlButton = ({
  conversation,
  onUpdateConversation,
}: HitlButtonProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const handleHitlAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedConversation = await assignConversationToHitl(
        conversation.id
      );
      if (updatedConversation) {
        onUpdateConversation({
          ...conversation,
          user_id: updatedConversation.user_id,
          need_human: updatedConversation.need_human,
        });
        toast.success(
          conversation.user_id === user?.id
            ? "Conversación desasignada exitosamente"
            : "Conversación asignada exitosamente"
        );
      }
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 400) {
        const result = await Swal.fire({
          title: "Conversación ya asignada",
          text: "¿Deseas reasignar esta conversación?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, reasignar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          try {
            const reassignedConversation = await assignConversationToHitl(
              conversation.id
            );
            if (reassignedConversation) {
              onUpdateConversation({
                ...conversation,
                user_id: reassignedConversation.user_id,
                need_human: reassignedConversation.need_human,
              });
              toast.success("Conversación reasignada exitosamente");
            }
          } catch (reassignError) {
            toast.error("Error al reasignar la conversación");
          }
        }
      } else {
        toast.error(
          conversation.user_id === user?.id
            ? "Error al desasignar la conversación"
            : "Error al asignar la conversación"
        );
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleHitlAction}
      title={
        conversation.user_id === null ? "Unassign from HITL" : "Assign to HITL"
      }
      className={`${conversation.user_id === null ? "bg-sofia-electricGreen" : `${conversation.need_human ? "bg-[#FF616D]" : "bg-[#FFBB93]"}`} rounded-[4px] px-[6px] h-[24px]`}
    >
      <p className="text-[12px] text-sofia-superDark font-semibold">
        {conversation.user_id === null
          ? "AI"
          : conversation.user_id === user?.id
            ? "Unassign"
            : "HITL"}
      </p>
    </button>
  );
};

interface ConversationCardProps {
  conversation: ConversationListItem;
  onUpdateConversation: (conversation: ConversationListItem) => void;
}

const ConversationCard = ({
  conversation,
  onUpdateConversation,
}: ConversationCardProps) => {
  const navigate = useNavigate();
  const lastMessage = conversation.message_text
    ? { type: conversation.message_type, text: conversation.message_text }
    : { type: MessageType.USER, text: "Sin mensajes" };

  const handleRowClick = () => {
    navigate(`/conversation/detail/${conversation.id}`);
  };

  return (
    <div
      className="min-h-[60px] text-[14px] border-b-[1px] border-b-app-lightGray last:border-b-0 hover:bg-gray-50 flex items-center cursor-pointer"
      onClick={handleRowClick}
    >
      <div className="pl-[16px] w-[calc(100%/19*2)]">
        <p className="text-sofia-superDark font-semibold text-[14px]">
          Usuario
        </p>
      </div>
      <div className="w-[calc(100%/19*2)]">
        <p className="text-sofia-superDark text-[14px]">
          ID: {conversation.id}
        </p>
      </div>
      <div className="w-[calc(100%/19*2)]">
        <p className="text-sofia-superDark text-[14px]">
          {conversation.department}
        </p>
      </div>
      <div className="w-[calc(100%/19*2)]">
        <p className="text-sofia-superDark text-[14px]">
          {lastMessage.type === MessageType.AGENT ? "Respondido" : "Pendiente"}
        </p>
      </div>
      <div className="hidden md:block w-[calc(100%/19*2)] pr-[16px]">
        <p className="text-sofia-superDark text-[14px]">
          {convertISOToReadable(conversation.created_at, false)}
        </p>
      </div>
      <div className="w-[calc(100%/19*5)] py-[8px] pr-[16px]">
        <div className="relative">
          <div className="h-[50px] overflow-hidden">
            <p className="line-clamp-2 text-[14px]">
              <MessagePreview type={lastMessage.type} text={lastMessage.text} />
            </p>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%/19*2)] flex justify-center items-center">
        {conversation.type === IntegrationType.CHAT_WEB && (
          <img className="select-none" src="/img/icon-web.svg" alt="Web" />
        )}
        {conversation.type === IntegrationType.MESSENGER && (
          <img className="select-none" src="/img/icon-fb.svg" alt="Facebook" />
        )}
        {conversation.type === IntegrationType.WHATSAPP && (
          <img className="select-none" src="/img/icon-wa.svg" alt="WhatsApp" />
        )}
        {conversation.type === IntegrationType.SLACK && (
          <img
            className="select-none w-[24px] h-[24px] bg-white p-[5px] rounded"
            src="/mvp/slack.svg"
            alt="WhatsApp"
          />
        )}
      </div>
      <div className="w-[calc(100%/19*3)] flex items-center">
        <HitlButton
          conversation={conversation}
          onUpdateConversation={onUpdateConversation}
        />
      </div>
      <div className="w-[calc(100%/19*1)] flex items-center justify-center pr-[12px]">
        <ButtonExportConversation conversation={conversation} />
      </div>
    </div>
  );
};

export default ConversationCard;
