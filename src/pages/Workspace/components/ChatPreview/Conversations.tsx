import { Fragment, useState } from "react";
import ConversationCard from "./ConversationCard";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation } from "@utils/interfaces";

interface ConversationsProps {
  conversations: IConversation[];
  config: ConfigWebChat;
  setConversation: (conversation: IConversation) => void;
}

const Conversations = ({
  conversations,
  config,
  setConversation,
}: ConversationsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Fragment>
      <div
        className="flex flex-1 flex-col p-[20px] overflow-auto"
        style={{
          backgroundColor: config.bg_chat,
        }}
      >
        <p className="text-sofia-superDark text-[14px] font-bold leading-[16px]">
          Conversaciones
        </p>
        <div className="flex flex-col gap-[8px] mt-[8px]">
          {conversations.map(conversation => {
            return (
              <ConversationCard
                key={conversation.id}
                setConversation={setConversation}
                conversation={conversation}
                config={config}
              />
            );
          })}
        </div>
        <div className="flex justify-center items-center h-[50px]">
          <button
            type="button"
            className="font-semibold text-[12px] py-[6px] px-[10px] rounded"
            style={{
              backgroundColor: isHovered ? config.button_color : "transparent",
              color: isHovered ? config.button_text : "#000000",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Nueva conversacion
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center h-[40px]">
        <img
          src={`${config.url_assets}/logos/${config.horizontal_logo}`}
          alt="logo"
          className="h-[20px]"
        />
      </div>
    </Fragment>
  );
};

export default Conversations;
