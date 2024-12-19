import { useState } from "react";
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
    <>
      <div
        className="flex flex-1 flex-col p-[20px] overflow-auto"
        style={{
          backgroundColor: config.bg_chat,
        }}
      >
        <div className="bg-white w-full border-[1px] border-gray-200 shadow-sm rounded">
          <div className="flex justify-center items-center h-[50px] border-b-[1px] border-b-gray-200">
            <p className="font-semibold">Conversaciones</p>
          </div>
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
          <div className="flex justify-center items-center h-[50px]">
            <button
              type="button"
              className="font-semibold text-[12px] py-[6px] px-[10px] rounded"
              style={{
                backgroundColor: isHovered
                  ? config.button_color
                  : "transparent",
                color: isHovered ? config.button_text : "#000000",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Nueva conversacion
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center h-[40px]">
        <img
          src={`${config.url_assets}/logos/${config.horizontal_logo}`}
          alt="logo"
          className="h-[20px]"
        />
      </div>
    </>
  );
};

export default Conversations;
