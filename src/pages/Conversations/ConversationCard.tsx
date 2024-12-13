import { Conversation, ConversationType, MessageType } from ".";
import { convertISOToReadable } from "@utils/format";
import { BsEye, BsHeadset, BsPersonDash } from "react-icons/bs";
import { assignConversationToHitl } from "@services/conversations";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "@store";

interface ConversationCardProps {
  conversation: Conversation;
  onTakeChat: (conversationId: number) => void;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const handleViewConversation = () => {
    // TODO: Implement view conversation logic
    console.log(`Viewing conversation ${conversation.id}`);
  };

  const handleHitlAction = async () => {
    try {
      await assignConversationToHitl(conversation.id);
      toast.success(
        conversation.userId === user?.id
          ? "Conversación desasignada exitosamente"
          : "Conversación asignada exitosamente"
      );
    } catch (error: unknown) {
      if (error?.response?.status === 400) {
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
            await assignConversationToHitl(conversation.id);
            toast.success("Conversación reasignada exitosamente");
          } catch (reassignError) {
            toast.error("Error al reasignar la conversación");
          }
        }
      } else {
        toast.error(
          conversation.userId === user?.id
            ? "Error al desasignar la conversación"
            : "Error al asignar la conversación"
        );
      }
    }
  };

  const lastMessage = conversation.messages[conversation.messages.length - 1];

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
              lastMessage.type === MessageType.USER
                ? "bg-yellow-50 text-yellow-600"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {lastMessage.type === MessageType.USER ? "Yes" : "No"}
          </span>
        </div>
      </td>
      <td className="w-[calc(100%/24*4)]">
        <div className="flex items-center">
          <button
            onClick={handleHitlAction}
            className={`flex items-center gap-1 px-1 py-2 rounded-full transition-colors ${
              conversation.userId === user?.id
                ? "text-red-600 hover:bg-red-50"
                : "text-purple-600 hover:bg-purple-50"
            }`}
            title={
              conversation.userId === user?.id
                ? "Unassign from HITL"
                : "Assign to HITL"
            }
          >
            {conversation.userId === user?.id ? (
              <BsPersonDash className="w-5 h-5" />
            ) : (
              <BsHeadset className="w-5 h-5" />
            )}
            <span className="hidden md:inline">
              {conversation.userId === user?.id ? "Unassign" : "HITL"}
            </span>
          </button>
          <button
            onClick={handleViewConversation}
            className="flex items-center gap-1 px-1 py-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title="View Conversation"
          >
            <BsEye className="w-5 h-5" />
            <span className="hidden md:inline">View</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ConversationCard;
