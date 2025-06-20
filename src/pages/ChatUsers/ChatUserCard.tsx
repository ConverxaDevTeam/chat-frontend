import { IChatUser, ChatUserType } from "@interfaces/chatUsers";

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

const ChatUserCard = ({ chatUser }: ChatUserCardProps) => {
  const standardInfo = chatUser?.standardInfo;

  // Safe access to potentially null/undefined values
  const name = standardInfo?.name || "Sin nombre";
  const email = standardInfo?.email || "Sin email";
  const phone = standardInfo?.phone || "Sin teléfono";
  const type = standardInfo?.type || ChatUserType.CHAT_WEB;
  const createdAt = standardInfo?.created_at;
  const lastLogin = standardInfo?.last_login;

  // If no standardInfo, don't render the card
  if (!standardInfo) {
    return null;
  }

  return (
    <div className="flex w-full border-b border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="w-[20%] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-sofia-superDark">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-sofia-superDark">
            {name}
          </span>
        </div>
      </div>

      <div className="w-[25%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">{email}</span>
      </div>

      <div className="w-[15%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">{phone}</span>
      </div>

      <div className="w-[12%] flex items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}
        >
          {getTypeLabel(type)}
        </span>
      </div>

      <div className="w-[15%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">
          {createdAt ? formatDate(createdAt) : "Sin fecha"}
        </span>
      </div>

      <div className="w-[13%] flex items-center">
        <span className="text-sm font-normal text-sofia-superDark">
          {lastLogin ? formatDate(lastLogin) : "Nunca"}
        </span>
      </div>
    </div>
  );
};

export default ChatUserCard;
