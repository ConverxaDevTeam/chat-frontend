import { convertISOToReadableMonthDayYear } from "@utils/format";
import { useEffect, useState } from "react";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation } from "@utils/interfaces";
import { getContrastingTextColor } from "@services/chat.service";

interface ConversationCardProps {
  setConversation: (conversation: IConversation) => void;
  conversation: IConversation;
  config: ConfigWebChat;
}

const ConversationCard = ({
  setConversation,
  conversation,
  config,
}: ConversationCardProps) => {
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (status && !active && countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setActive(false);
      setStatus(false);
      setCountdown(5);
    }

    return () => {
      clearInterval(countdownTimer);
    };
  }, [status, active, countdown]);

  const textColor = getContrastingTextColor(config.bg_assistant);

  return (
    <div
      className="flex flex-col p-[16px] gap-[8px] items-start self-stretch rounded-tr-[8px] rounded-bl-[8px] rounded-tl-[8px] border border-sofia-darkBlue bg-[#FCFCFC] hover:bg-slate-100 cursor-pointer"
      style={{
        backgroundColor: config.bg_assistant,
        color: textColor,
      }}
      onClick={() => setConversation(conversation)}
    >
      <span className="text-[14px] font-bold leading-[16px]">
        {conversation.messages.length > 0
          ? convertISOToReadableMonthDayYear(
              conversation.messages[conversation.messages.length - 1].created_at
            )
          : "..."}
      </span>
      <span className="text-[14px] font-normal leading-none truncate">
        {conversation.messages.length > 0
          ? conversation.messages[conversation.messages.length - 1].text
          : "..."}
      </span>
    </div>
  );
};

export default ConversationCard;
