interface Message {
  sender: "user" | "agent";
  text: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex flex-col space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-md max-w-xs ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};
