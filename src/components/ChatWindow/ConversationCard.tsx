import { FC } from "react";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  integration: string;
}

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationCard: FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex h-[70px] px-4 items-center gap-3 w-full ${
        isSelected ? "bg-sofia-celeste" : "bg-sofia-blancoPuro"
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-app-c3">
        {/* Add avatar image or initials here */}
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <h3 className="font-medium">{conversation.name}</h3>
        <p className="text-sm text-app-text truncate">
          {conversation.lastMessage}
        </p>
      </div>

      {/* Time and Status */}
      <div className="text-right">
        <p className="text-xs text-app-text">{conversation.time}</p>
        {conversation.unread && (
          <span className="inline-block px-2 py-1 text-xs bg-sofia-electricGreen text-app-white rounded-full">
            {conversation.unread}
          </span>
        )}
      </div>
    </button>
  );
};
