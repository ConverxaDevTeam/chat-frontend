import { useEffect, useRef } from "react";
import MessageCard from "@components/ChatWindow/MessageCard";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation, IMessage, MessageType } from "@utils/interfaces";
import {
  ConversationResponseMessage,
  FormInputs,
} from "@interfaces/conversation";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import { useForm } from "react-hook-form";

interface ChatProps {
  config: ConfigWebChat;
  conversation: IConversation;
}

const transformMessage = (message: IMessage): ConversationResponseMessage => ({
  id: message.id || Math.random(),
  created_at: message.created_at || new Date().toISOString(),
  text: message.text || "",
  audio: message.audio || null,
  images: message.images || null,
  type: message.type,
  time: Date.now(),
});

const Chat = ({ config, conversation }: ChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit } = useForm<FormInputs>();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    // Mover el scroll hacia el final del contenedor cuando cambian los mensajes
    scrollToBottom();
  }, [conversation?.messages?.length]);

  return (
    <>
      <div
        className="flex flex-col flex-1 overflow-y-auto pt-[10px] px-[20px] gap-[10px]"
        style={{
          backgroundColor: config.bg_chat,
        }}
      >
        {conversation?.messages &&
          conversation.messages.map(message => {
            const userName =
              message.type === MessageType.AGENT ? config.name : "Demo Usuario";

            return (
              <MessageCard
                key={`chat-msg-${message.id}`}
                message={transformMessage(message)}
                userName={userName}
                config={config}
              />
            );
          })}
        <div ref={messagesEndRef}></div>
      </div>
      <MessageForm
        config={config}
        showHitl={false}
        form={{
          register,
          handleSubmit,
          isSubmitting: false,
        }}
        onSubmit={() => {}}
      />
    </>
  );
};

export default Chat;
