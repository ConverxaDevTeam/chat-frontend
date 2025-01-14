import { IntegrationType } from "@interfaces/integrations";
import { FC } from "react";

interface IntegrationData {
  type: "IA" | "HITL";
  status?: "pending" | "taken" | "auto";
  messages: number;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  integration: IntegrationType;
  avatar: string;
  integrationData: IntegrationData;
}

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const getHitlBackground = (status?: string) => {
  switch (status) {
    case "taken":
      return "bg-sofia-hitlPending";
    case "pending":
    default:
      return "bg-sofia-error"; // Rojo: no se ha recibido respuesta
  }
};

const getHitlText = (status?: string) => {
  switch (status) {
    case "taken":
      return "HITL";
    case "auto":
      return "IA";
    case "pending":
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
  const isAvatarUrl = conversation.avatar.startsWith("/");
  const { type, status } = conversation.integrationData;

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
          <div className="flex flex-col justify-center flex-1 self-stretch">
            <p className="font-quicksand text-xs text-sofia-superDark text-left truncate">
              {conversation.lastMessage}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <img
              src={getIntegrationIcon(conversation.integration)}
              alt={conversation.integration}
              className="w-4 h-4"
            />
            {type === "HITL" ? (
              <div
                className={`h-4 px-1 flex justify-center items-center ${getHitlBackground(status)}`}
              >
                <span className="font-quicksand text-tiny text-sofia-superDark">
                  {getHitlText(status)}
                </span>
              </div>
            ) : (
              <div className="w-4 h-4 flex justify-center items-center p-0.5 rounded-[2px] bg-sofia-electricGreen">
                <span className="font-quicksand text-tiny text-sofia-superDark">
                  {type}
                </span>
              </div>
            )}
            {conversation.unread && (
              <div className="w-4 h-4 flex justify-center items-center p-0.5 rounded-full bg-sofia-electricOlive">
                <span className="font-quicksand text-tiny text-sofia-superDark">
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
