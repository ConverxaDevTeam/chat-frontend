import { convertISOToReadableMonthDayYear } from "@utils/format";
import { useEffect, useState } from "react";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation } from "@utils/interfaces";

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

  return (
    <div className=" relative">
      {status && !active ? (
        <button
          className="absolute top-[5px] right-[5px] py-[1px] w-[80px] font-semibold text-[12px] text-green-500 border-green-700 border-[1px] bg-green-100 rounded-lg"
          disabled={active}
          onClick={() => {
            setActive(true);
          }}
        >
          Confirmar({countdown})
        </button>
      ) : (
        <button
          className="absolute top-[5px] right-[5px] py-[1px] w-[80px] font-semibold text-[12px] text-red-500 border-red-700 bg-red-100 border-[1px] rounded-lg"
          type="button"
          title="Eliminar conversación"
          onClick={() => {
            setStatus(true);
          }}
          disabled={active}
        >
          {!active ? "Eliminar" : "Elimimando..."}
        </button>
      )}
      <div
        onClick={() => setConversation(conversation)}
        className="flex items-center gap-[10px] p-[10px] hover:bg-slate-100 cursor-pointer"
      >
        <div
          className="rounded-full w-[40px] h-[40px]"
          style={{
            backgroundColor: config.bg_color,
          }}
        ></div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-[10px]">
            <p className="font-semibold text-[14px]">
              {conversation.messages.length > 0 ? (
                <span>
                  {conversation.messages[conversation.messages.length - 1]
                    .type === "agent"
                    ? config.name
                    : "Usuario"}
                </span>
              ) : (
                <span>...</span>
              )}
            </p>
            <p className="text-[14px]">
              {conversation.messages.length > 0 ? (
                <span>
                  {convertISOToReadableMonthDayYear(
                    conversation.messages[conversation.messages.length - 1]
                      .created_at
                  )}
                </span>
              ) : (
                <span>...</span>
              )}
            </p>
          </div>
          <p className="text-[13px]">
            {conversation.messages.length > 0 ? (
              <span>
                {conversation.messages[conversation.messages.length - 1].text}
              </span>
            ) : (
              <span>...</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
