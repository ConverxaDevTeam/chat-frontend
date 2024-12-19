import { convertISOToReadable } from "@utils/format";
import { BsEye, BsHeadset, BsPersonDash } from "react-icons/bs";
import { assignConversationToHitl } from "@services/conversations";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Conversation,
  MessageType,
  ConversationType,
} from "@interfaces/conversation";

interface HitlButtonProps {
  conversation: Conversation;
  onUpdateConversation: (conversation: Conversation) => void;
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
          conversation.user?.id === user?.id
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
          conversation.user?.id === user?.id
            ? "Error al desasignar la conversación"
            : "Error al asignar la conversación"
        );
      }
    }
  };

  return (
    <button
      onClick={handleHitlAction}
      className={`flex items-center gap-1 px-1 py-2 rounded-full transition-colors ${
        conversation.user?.id === user?.id
          ? "text-red-600 hover:bg-red-50"
          : "text-purple-600 hover:bg-purple-50"
      }`}
      title={
        conversation.user?.id === user?.id
          ? "Unassign from HITL"
          : "Assign to HITL"
      }
    >
      {conversation.user?.id === user?.id ? (
        <BsPersonDash className="w-5 h-5" />
      ) : (
        <BsHeadset className="w-5 h-5" />
      )}
      <span className="hidden md:inline">
        {conversation.user?.id === user?.id ? "Unassign" : "HITL"}
      </span>
    </button>
  );
};

interface ConversationCardProps {
  conversation: Conversation;
  onUpdateConversation: (conversation: Conversation) => void;
}

const ConversationCard = ({
  conversation,
  onUpdateConversation,
}: ConversationCardProps) => {
  const lastMessage = conversation.messages[
    conversation.messages.length - 1
  ] || {
    type: MessageType.USER,
    text: "Sin mensajes",
  };

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
        <div className="flex items-center gap-2 p-4">
          <span
            className={`font-medium ${
              lastMessage.type === MessageType.AGENT
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            {lastMessage.type === MessageType.AGENT ? "Agente" : "Usuario"}:
          </span>
          <p className="font-poppinsRegular text-[#212121] truncate">
            {lastMessage.text}
          </p>
        </div>
      </td>
      <td className="w-[calc(100%/24*2)]">
        <p className="font-poppinsRegular text-[#212121]">
          {conversation.type === ConversationType.CHAT_WEB && "Web Chat"}
          {conversation.type === ConversationType.MESSENGER && "Messenger"}
          {conversation.type === ConversationType.WHATSAPP && "WhatsApp"}
        </p>
      </td>
      <td className="w-[calc(100%/24*2)]">
        <div className="flex justify-center">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              conversation.need_human
                ? "bg-yellow-50 text-yellow-600"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {conversation.need_human ? "Yes" : "No"}
          </span>
        </div>
      </td>
      <td className="w-[calc(100%/24*4)]">
        <div className="flex items-center">
          <HitlButton
            conversation={conversation}
            onUpdateConversation={onUpdateConversation}
          />
          <Link
            to={`/conversation/detail/${conversation.id}`}
            className="flex items-center gap-1 px-1 py-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title="View Conversation"
          >
            <BsEye className="w-5 h-5" />
            <span className="hidden md:inline">View</span>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default ConversationCard;
