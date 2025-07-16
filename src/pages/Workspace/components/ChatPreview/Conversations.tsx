import { Fragment } from "react";
import ConversationCard from "./ConversationCard";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation } from "@utils/interfaces";
import { Button } from "@components/common/Button";

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
  return (
    <Fragment>
      <div
        className="flex flex-1 flex-col p-[20px] overflow-auto"
        style={{
          backgroundColor: config.bg_chat,
        }}
      >
        <p className="text-app-superDark text-[14px] font-bold leading-[16px]">
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
      </div>
      <div className="w-full flex flex-col p-[20px] items-center gap-[20px]">
        <Button variant="primary" className="w-full">
          Nueva conversacion
        </Button>

        <div className="w-full flex justify-center items-center h-[40px]">
          <img
            src={`${config.url_assets}/logos/${config.horizontal_logo}`}
            alt="logo"
            className="h-[30px]"
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Conversations;
