import MessageCard from "@components/ChatWindow/MessageCard";
import { Message } from "../chatHook";
import { MessageType } from "@utils/interfaces";
import { ConversationResponseMessage } from "@interfaces/conversation";

interface ChatHistoryProps {
  messages: Message[];
}

const transformMessageToConversationMessage = (
  message: Message
): ConversationResponseMessage => ({
  id: Math.random(),
  created_at: new Date().toISOString(),
  text: message.text,
  type: message.sender === "user" ? MessageType.USER : MessageType.AGENT,
  audio: null,
  images: message.images || null,
});

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto w-full">
      {messages.map((message, index) => (
        <MessageCard
          key={index}
          message={transformMessageToConversationMessage(message)}
          userName={message.sender}
        />
      ))}
    </div>
  );
};
