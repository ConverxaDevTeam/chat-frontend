import MessageCard from "@components/ChatWindow/MessageCard";
import { Message } from "../chatHook";
import { IMessage, MessageFormatType, MessageType } from "@utils/interfaces";

interface ChatHistoryProps {
  messages: Message[];
}

const transformMessageToIMessage = (message: Message): IMessage => ({
  id: Math.random(), // Generamos un id aleatorio ya que Message no lo tiene
  text: message.text,
  created_at: new Date().toISOString(), // Usamos la fecha actual ya que Message no tiene created_at
  type: message.sender === "user" ? MessageType.USER : MessageType.AGENT,
  format: MessageFormatType.TEXT,
  audio: null,
  images: message.images ?? [],
});

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageCard
          key={index}
          message={transformMessageToIMessage(message)}
        />
      ))}
    </div>
  );
};
