import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useChat } from "./chatHook";
import { useEffect } from "react";
import { connectToAgentRoom } from "@store/actions/auth";

interface ChatProps {
  onClose?: () => void;
}

const Chat = ({ onClose }: ChatProps) => {
  const { messages, inputValue, setInputValue, handleSendMessage } = useChat();
  const dispatch = useAppDispatch();
  const connected = useAppSelector((state) => {
    return state.chat.connected
  }); // Estado de conexión

  useEffect(() => {
    if (!connected) {
      // Solo intentamos conectar cuando el agentId esté disponible y no esté conectado
      dispatch(connectToAgentRoom());
    }
  }, [dispatch, connected]); // Ejecutar cuando el agentId cambia o la conexión cambia

  return (
    <div className="grid grid-rows-[auto,1fr,auto] w-full h-full bg-gray-100 border-r border-gray-300 shadow-lg">
      {/* Encabezado del chat */}
      <ChatHeader onClose={onClose} />

      {/* Mensajes del chat */}
      <ChatHistory messages={messages} />

      {/* Campo para escribir */}
      <ChatFooter
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};


export default Chat;

// Subcomponentes (mantienen la estructura anterior)

const ChatHeader = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="p-4 bg-blue-500 text-white font-semibold flex justify-between items-center">
      <span className="text-left">Chat</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 focus:outline-none"
          aria-label="Cerrar chat"
        >
          ✕
        </button>
      )}
    </div>
  );
};

const ChatHistory = ({ messages }: { messages: { sender: "user" | "agent"; text: string }[] }) => {
  return (
    <div className="p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 p-2 rounded-md max-w-xs ${
            message.sender === "user"
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-200 text-gray-800 self-start"
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

const ChatFooter = ({
  inputValue,
  onInputChange,
  onSendMessage,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}) => {
  return (
    <div className="grid grid-cols-[1fr,auto] gap-2 p-4 border-t border-gray-300">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe un mensaje..."
      />
      <button
        onClick={onSendMessage}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
};
