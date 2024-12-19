import MessageCard from "@components/ChatWindow/MessageCard";
import { IMessage } from "@pages/Workspace/components/ChatPreview";
import { Message } from "../chatHook";

interface ChatHistoryProps {
  messages: Message[];
}

const transformMessageToIMessage = (message: Message): IMessage => ({
  id: Math.random(), // Generamos un id aleatorio ya que Message no lo tiene
  text: message.text,
  type: message.sender,
  created_at: new Date().toISOString(), // Usamos la fecha actual ya que Message no tiene created_at
});

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageCard
          key={index}
          menssage={transformMessageToIMessage(message)}
        />
      ))}
    </div>
  );
};
