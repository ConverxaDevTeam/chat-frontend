import { useEffect } from "react";
import { useAppSelector } from "@store/hooks";
import { emitWebSocketEvent, onWebSocketEvent, leaveRoom } from "@services/websocket.service"; // Importar las funciones de WebSocket
import { useChat } from "./chatHook";

interface ChatProps {
  onClose?: () => void;
}

const Chat = ({ onClose }: ChatProps) => {
  const { inputValue, setInputValue, addMessage, simulateAgentResponse, messages } = useChat();
  const connected = useAppSelector((state) => state.chat.connected); // Estado de conexión
  const agentId = useAppSelector((state) => state.chat.currentAgent?.id); // Obtener el agentId desde Redux
  const roomName = `test-chat-${agentId}`; // El nombre del room en el que está el cliente

  useEffect(() => {
    if (!connected) return;
    // Escuchar los mensajes del agente a través de WebSocket
    onWebSocketEvent("message", (message) => {
      console.log("Mensaje recibido", message);
      addMessage({ sender: "agent", text: message.text });
    });

    // Escuchar el evento 'typing' para mostrar el estado de escritura
    onWebSocketEvent("typing", (data) => {
      console.log("Estado de escritura del usuario:", data); // Log para depurar
    });

    // Limpieza cuando el componente se desmonta o se cierra
    return () => {
      if (connected) {
        // Salir del room cuando el chat se cierre
        leaveRoom(roomName);
      }
    };
  }, [agentId, connected, roomName, addMessage, simulateAgentResponse]); // Ejecutar cuando el estado de conexión cambia

  // Función para manejar el envío de un mensaje
  const handleSendMessageToAgent = () => {
    if (inputValue.trim() !== "") {
      // Emitir el mensaje al backend, incluyendo el room al que pertenece
      emitWebSocketEvent('message', { sender: 'user', text: inputValue, room: roomName });

      // Agregar el mensaje al historial (localmente, sin Redux)
      addMessage({ sender: "user", text: inputValue });

      // Limpiar el input después de enviar el mensaje
      setInputValue("");
    }
  };

  const handleChatClose = () => {
    // Llamar a la función onClose proporcionada si existe
    if (onClose) {
      onClose();
    }

    // Asegurarse de salir del room cuando el chat se cierre
    if (connected) {
      console.log("Chat cerrado", connected);
      leaveRoom(roomName);
    }
  };

  return (
    <div className="grid grid-rows-[auto,1fr,auto] w-full h-full bg-gray-100 border-r border-gray-300 shadow-lg">
      {/* Encabezado del chat */}
      <ChatHeader onClose={handleChatClose} />

      {/* Mensajes del chat */}
      <ChatHistory messages={messages} />

      {/* Campo para escribir */}
      <ChatFooter
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessageToAgent} // Enviar el mensaje al agente
      />
    </div>
  );
};

export default Chat;

// Subcomponentes (sin cambios)

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
        onClick={onSendMessage} // Usamos handleSendMessage para enviar el mensaje
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
};
