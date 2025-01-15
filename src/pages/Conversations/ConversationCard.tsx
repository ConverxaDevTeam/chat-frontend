import { convertISOToReadable } from "@utils/format";
import { BsEye, BsHeadset, BsPersonDash } from "react-icons/bs";
import { assignConversationToHitl } from "@services/conversations";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MessageType, ConversationListItem } from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import { ReactNode } from "react";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  activeClass?: string;
  inactiveClass?: string;
}

const StatusBadge = ({
  isActive,
  activeText = "Yes",
  inactiveText = "No",
  activeClass = "bg-yellow-50 text-yellow-600",
  inactiveClass = "bg-gray-50 text-gray-600",
}: StatusBadgeProps) => (
  <span
    className={`px-2 py-1 rounded-full text-sm font-medium ${isActive ? activeClass : inactiveClass}`}
  >
    {isActive ? activeText : inactiveText}
  </span>
);

interface ActionButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  colorClass: string;
  title: string;
  showLabel?: boolean;
  to?: string;
}

const ActionButton = ({
  onClick,
  icon,
  label,
  colorClass,
  title,
  showLabel = false,
  to,
}: ActionButtonProps) => {
  const ButtonContent = () => (
    <>
      {icon}
      {showLabel && <span className="hidden md:inline">{label}</span>}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`flex items-center gap-1 px-1 py-2 rounded-full transition-colors ${colorClass}`}
        title={title}
      >
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-1 py-2 rounded-full transition-colors ${colorClass}`}
      title={title}
    >
      <ButtonContent />
    </button>
  );
};

interface MessagePreviewProps {
  type: MessageType;
  text: string;
}

const MessagePreview = ({ type, text }: MessagePreviewProps) => (
  <div className="flex items-center gap-2 p-4">
    <span
      className={`font-medium ${type === MessageType.AGENT ? "text-blue-600" : "text-gray-600"}`}
    >
      {type === MessageType.AGENT ? "Agente" : "Usuario"}:
    </span>
    <p className="font-poppinsRegular text-[#212121] truncate">{text}</p>
  </div>
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

  const handleHitlAction = async () => {
    try {
      const updatedConversation = await assignConversationToHitl(
        conversation.id
      );
      if (updatedConversation) {
        onUpdateConversation(updatedConversation);
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
              onUpdateConversation(reassignedConversation);
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
    <ActionButton
      onClick={handleHitlAction}
      icon={
        conversation.user_id === user?.id ? (
          <BsPersonDash className="w-5 h-5" />
        ) : (
          <BsHeadset className="w-5 h-5" />
        )
      }
      label={conversation.user_id === user?.id ? "Unassign" : "HITL"}
      colorClass={
        conversation.user_id === user?.id
          ? "text-red-600 hover:bg-red-50"
          : "text-purple-600 hover:bg-purple-50"
      }
      title={
        conversation.user_id === user?.id
          ? "Unassign from HITL"
          : "Assign to HITL"
      }
      showLabel={true}
    />
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
  const lastMessage = conversation.message_text
    ? { type: conversation.message_type, text: conversation.message_text }
    : { type: MessageType.USER, text: "Sin mensajes" };

  return (
    <tr className="h-[60px] text-[14px] border-b-[1px] hover:bg-gray-50">
      <td className="w-[calc(100%/24*2)]">
        <p className="font-poppinsRegular text-[#212121]">{conversation.id}</p>
      </td>
      <td className="w-[calc(100%/24*2)]">
        <p className="font-poppinsRegular text-[#212121]">
          {lastMessage.type === MessageType.AGENT ? "Respondido" : "Pendiente"}
        </p>
      </td>
      <td className="hidden md:table-cell w-[calc(100%/24*2)]">
        <p className="font-poppinsRegular text-[#212121]">
          {convertISOToReadable(conversation.created_at)}
        </p>
      </td>
      <td className="max-w-2 w-2">
        <MessagePreview type={lastMessage.type} text={lastMessage.text} />
      </td>
      <td className="w-[calc(100%/24*2)]">
        <p className="font-poppinsRegular text-[#212121]">
          {conversation.type === IntegrationType.CHAT_WEB && "Web Chat"}
          {conversation.type === IntegrationType.MESSENGER && "Messenger"}
          {conversation.type === IntegrationType.WHATSAPP && "WhatsApp"}
        </p>
      </td>
      <td className="w-[calc(100%/24*2)]">
        <div className="flex justify-center">
          <StatusBadge isActive={conversation.need_human} />
        </div>
      </td>
      <td className="w-[calc(100%/24*4)]">
        <div className="flex items-center">
          <HitlButton
            conversation={conversation}
            onUpdateConversation={onUpdateConversation}
          />
          <ActionButton
            icon={<BsEye className="w-5 h-5" />}
            label="View"
            colorClass="text-gray-600 hover:bg-gray-50"
            title="View Conversation"
            to={`/conversation/detail/${conversation.id}`}
          />
        </div>
      </td>
    </tr>
  );
};

export default ConversationCard;
