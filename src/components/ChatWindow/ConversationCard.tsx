import { Avatar } from "@components/ChatWindow/Avatar";
import {
  ConversationListItem,
  ConversationStatus,
  getConversationStatus,
} from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import { formatDateOrTime } from "@utils/format";
import { FC } from "react";

interface ConversationCardProps {
  conversation: ConversationListItem;
  isSelected: boolean;
  onClick: () => void;
}

const getHitlBackground = (status: ConversationStatus) => {
  switch (status) {
    case ConversationStatus.TAKEN:
      return "bg-sofia-hitlPending"; // Naranja: tomado por humano
    case ConversationStatus.IA:
      return "bg-sofia-electricGreen"; // Verde: respuesta automática con IA
    case ConversationStatus.PENDING:
    default:
      return "bg-sofia-error"; // Rojo: no se ha recibido respuesta
  }
};

const getHitlText = (status: ConversationStatus) => {
  switch (status) {
    case ConversationStatus.IA:
      return "IA";
    case ConversationStatus.TAKEN:
    case ConversationStatus.PENDING:
    default:
      return "HITL";
  }
};

const getIntegrationIcon = (integration: IntegrationType) => {
  switch (integration) {
    case IntegrationType.WHATSAPP:
      return "/mvp/whatsapp.svg";
    case IntegrationType.MESSENGER:
      return "/mvp/messenger.svg";
    default:
      return "/mvp/globe.svg";
  }
};

export const ConversationCard: FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const status = getConversationStatus(
    conversation.need_human,
    conversation.user_id
  );

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
      <Avatar avatar={conversation.avatar} secret={conversation.secret} />

      {/* Content */}
      <div className="flex flex-col h-9 min-w-0 max-w-[calc(100%-4rem)] items-start gap-0.5 flex-1">
        {/* Frame Superior */}
        <div className="flex justify-between items-center w-full">
          <h3 className="text-sm font-bold text-sofia-superDark truncate flex-1 min-w-0 text-left">
            {conversation.secret}
          </h3>
          <span className="text-sm font-semibold text-app-newGray ml-2 flex-shrink-0">
            {conversation.message_created_at
              ? formatDateOrTime(conversation.message_created_at)
              : ""}
          </span>
        </div>

        {/* Frame Inferior */}
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-sofia-superDark text-left truncate">
              {conversation.message_text}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <img
              src={getIntegrationIcon(conversation.type)}
              alt={conversation.type}
              className="w-4 h-4"
            />
            <div
              className={`h-4 px-1 flex justify-center items-center ${getHitlBackground(status)}`}
            >
              <span className="text-tiny text-sofia-superDark">
                {getHitlText(status)}
              </span>
            </div>
            {conversation.unread_messages > 0 && (
              <div className="w-4 h-4 flex justify-center items-center p-0.5 rounded-full bg-sofia-electricOlive">
                <span className="text-tiny text-sofia-superDark">
                  {conversation.unread_messages}
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
