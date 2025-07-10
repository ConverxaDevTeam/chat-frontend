import { IChatUser, ChatUserType } from "@interfaces/chatUsers";
import { useNavigate } from "react-router-dom";

interface ChatUserCardProps {
  chatUser: IChatUser;
}

const getTypeLabel = (type: ChatUserType): string => {
  switch (type) {
    case ChatUserType.CHAT_WEB:
      return "Chat Web";
    case ChatUserType.WHATSAPP:
      return "WhatsApp";
    case ChatUserType.MESSENGER:
      return "Messenger";
    case ChatUserType.SLACK:
      return "Slack";
    default:
      return type;
  }
};

const getTypeColor = (type: ChatUserType): string => {
  switch (type) {
    case ChatUserType.CHAT_WEB:
      return "bg-blue-100 text-blue-800";
    case ChatUserType.WHATSAPP:
      return "bg-green-100 text-green-800";
    case ChatUserType.MESSENGER:
      return "bg-purple-100 text-purple-800";
    case ChatUserType.SLACK:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "ia":
      return "bg-blue-100 text-blue-800";
    case "pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "asignado":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "ia":
      return "IA";
    case "pendiente":
      return "Pendiente";
    case "asignado":
      return "Asignado";
    default:
      return status;
  }
};

const ChatUserCard = ({ chatUser }: ChatUserCardProps) => {
  const navigate = useNavigate();
  const standardInfo = chatUser?.standardInfo;
  const lastConversation = chatUser?.lastConversation;

  // Safe access to potentially null/undefined values
  const name = standardInfo?.name || "Sin nombre";
  const email = standardInfo?.email || "Sin email";
  const phone = standardInfo?.phone || "Sin teléfono";
  const type = standardInfo?.type || ChatUserType.CHAT_WEB;
  const createdAt = standardInfo?.created_at;

  // If no standardInfo, don't render the card
  if (!standardInfo) {
    return null;
  }

  const handleRowClick = () => {
    if (lastConversation?.conversation_id) {
      navigate(`/conversations/detail/${lastConversation.conversation_id}`);
    }
  };

  return (
    <div
      className={`flex w-full border-b border-gray-200 px-4 py-4 transition-colors ${
        lastConversation?.conversation_id
          ? "cursor-pointer hover:bg-blue-50 hover:border-blue-200"
          : "hover:bg-gray-50"
      }`}
      onClick={handleRowClick}
      title={
        lastConversation?.conversation_id
          ? "Click para ver la conversación"
          : ""
      }
    >
      <div className="w-[18%] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-sofia-superDark">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-sofia-superDark">
            {name}
          </span>
          {lastConversation?.unread_messages &&
            lastConversation.unread_messages > 0 && (
              <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 w-fit">
                {lastConversation.unread_messages} no leídos
              </span>
            )}
        </div>
      </div>

      <div className="w-[20%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">
          {email}
        </span>
      </div>

      <div className="w-[12%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">
          {phone}
        </span>
      </div>

      <div className="w-[10%] flex items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}
        >
          {getTypeLabel(type)}
        </span>
      </div>

      <div className="w-[15%] flex items-center">
        <div className="flex flex-col">
          {lastConversation ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    {formatDate(lastConversation.last_message_created_at)}
                  </span>
                  <span className="text-sm font-normal text-sofia-superDark truncate max-w-[120px]">
                    {lastConversation.last_message_text || "Sin mensaje"}
                  </span>
                  <span className="text-xs text-blue-600 opacity-75">
                    Click para ver conversación
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 opacity-75"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-gray-500">
                Sin conversaciones
              </span>
              <span className="text-xs text-gray-400">(No clickeable)</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-[10%] flex items-center">
        {lastConversation ? (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lastConversation.status)}`}
            >
              {getStatusLabel(lastConversation.status)}
            </span>
            {lastConversation.need_human && (
              <span className="text-xs text-red-600 font-medium">
                Necesita humano
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm font-normal text-sofia-superDark">-</span>
        )}
      </div>

      <div className="w-[15%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">
          {createdAt ? formatDate(createdAt) : "Sin fecha"}
        </span>
      </div>
    </div>
  );
};

export default ChatUserCard;
