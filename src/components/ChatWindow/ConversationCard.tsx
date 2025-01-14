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
            <div className="absolute inset-0 rounded-full bg-sofia-electricLight border border-sofia-superDark" />
            <span className="relative z-10 font-quicksand text-base font-semibold text-sofia-superDark">
              {conversation.avatar}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col h-9 items-start gap-0.5 flex-1">
        {/* Frame Superior */}
        <div className="flex justify-between items-center w-full">
          <h3 className="font-quicksand text-sm font-bold text-sofia-superDark">
            {conversation.name}
          </h3>
          <span className="font-quicksand text-sm font-semibold text-app-newGray">
            {conversation.time}
          </span>
        </div>

        {/* Frame Inferior */}
        <div className="flex justify-center items-center gap-1 flex-1 w-full">
          <p className="flex flex-col justify-center flex-1 self-stretch font-quicksand text-xs font-semibold text-sofia-superDark">
            {conversation.lastMessage}
          </p>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 flex justify-center items-center p-0.5 rounded-[2px] bg-sofia-electricGreen">
              <span
                className={`text-[10px] font-medium ${
                  type === "HITL" ? getHitlColor(status) : "text-blue-500"
                }`}
              >
                {type}
              </span>
            </div>
            {conversation.unread && (
              <div className="w-4 h-4 flex justify-center items-center p-0.5 rounded-full bg-sofia-electricOlive">
                <span className="text-[10px] font-medium text-sofia-superDark">
                  {conversation.unread}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-end gap-1"></div>
    </button>
  );
};
