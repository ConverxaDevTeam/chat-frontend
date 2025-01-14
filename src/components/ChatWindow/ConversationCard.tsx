import { FC } from "react";

interface IntegrationData {
  type: "IA" | "HITL";
  status?: "assigned" | "pending" | "unassigned";
  messages: number;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  integration: string;
  avatar: string;
  status?: "writing" | "resolved";
  integrationData: IntegrationData;
}

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const getHitlColor = (status?: string) => {
  switch (status) {
    case "assigned":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "unassigned":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export const ConversationCard: FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const isAvatarUrl = conversation.avatar.startsWith("/");
  const { type, status, messages } = conversation.integrationData;

  return (
    <button
      onClick={onClick}
      className={`flex h-[70px] px-4 items-center gap-3 w-full transition-colors ${
        isSelected
          ? "bg-sofia-celeste"
          : "bg-sofia-blancoPuro hover:bg-sofia-background"
      }`}
    >
      {/* Avatar */}
      <div className="w-12 h-12 flex-shrink-0 relative">
        {isAvatarUrl ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-sofia-superDark">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-[#DDFBC7] border border-sofia-superDark" />
            <span className="relative z-10 font-quicksand text-base font-semibold text-sofia-superDark">
              {conversation.avatar}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{conversation.name}</h3>
          {conversation.status === "writing" && (
            <span className="text-xs text-app-newGray">escribiendo...</span>
          )}
        </div>
        <p className="text-xs text-app-text truncate">
          {conversation.lastMessage}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-end gap-1">
        {/* Time and Integration Info */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-app-text">{conversation.time}</span>
          <div className="flex items-center gap-1 bg-sofia-background rounded px-1.5 py-0.5">
            <span
              className={`text-[10px] font-medium ${
                type === "HITL" ? getHitlColor(status) : "text-blue-500"
              }`}
            >
              {type}
            </span>
            <span className="text-[10px] font-medium text-app-newGray">
              {messages}
            </span>
          </div>
        </div>

        {/* Unread Count */}
        {conversation.unread && (
          <span className="inline-block px-2 py-0.5 text-[10px] bg-sofia-electricGreen text-app-white rounded-full">
            {conversation.unread}
          </span>
        )}
      </div>
    </button>
  );
};
