import { Conversation, ConversationType, MessageType } from ".";
import { convertISOToReadable } from "@utils/format";
import { HiUserCircle } from "react-icons/hi";
import { BsEye } from "react-icons/bs";

interface ConversationCardProps {
  conversation: Conversation;
  onTakeChat: (conversationId: number) => void;
}

const ConversationCard = ({
  conversation,
  onTakeChat,
}: ConversationCardProps) => {
  const handleViewConversation = () => {
    // TODO: Implement view conversation logic
    console.log(`Viewing conversation ${conversation.id}`);
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
          {!conversation.userId ? (
            <button
              onClick={() => onTakeChat(conversation.id)}
              className="flex items-center gap-1 px-1 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Take Chat"
            >
              <HiUserCircle className="w-5 h-5" />
              <span className="hidden md:inline">Take</span>
            </button>
          ) : (
            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
              Active
            </span>
          )}
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
