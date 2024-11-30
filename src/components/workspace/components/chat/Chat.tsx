import { memo, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { onWebSocketEvent, leaveRoom, joinRoom } from "@services/websocket.service";
import { useChat } from "./chatHook";
import { toast } from 'react-toastify';

interface ChatProps {
  onClose?: () => void;
}

const Chat = memo(({ onClose }: ChatProps) => {
  let connected = false
  const agentId = useAppSelector((state) => state.chat.currentAgent?.id);
  const roomName = `test-chat-${agentId}`;
  const { 
    inputValue, 
    setInputValue, 
    addMessage, 
    messages, 
    handleSendMessage,
    setThreatId,
    setAgentId,
    agentId: agentIdState,
    threatId,
    resetChat
  } = useChat(roomName);

  useEffect(() => {
    if (!connected) {
      joinRoom(roomName);
      connected = true;

      console.log("Conectando al chat", connected);
    }
    return () => {
      if (connected) {
        leaveRoom(roomName);
        connected = false;
      console.log("Desconectando del chat", connected);
      }
    };
  }, []);

  useEffect(() => {
    if (!connected || !agentId) return;

    // Escuchar mensajes del agente
    onWebSocketEvent("message", (response) => {
      if (threatId !== response.conf.threadId) setThreatId(response.conf.threadId);
      if (agentIdState !== response.conf.agentId) setAgentId(response.conf.agentId);
      addMessage({
        sender: "agent",
        text: response.text,
      });
    });

    // Escuchar el evento 'typing'
    onWebSocketEvent("typing", (message) => {
      addMessage({
        sender: "user",
        text: message,
      });
    });

    // Escuchar el evento 'agent:updated'
    onWebSocketEvent("agent:updated", () => {
      toast.info('El agente se ha actualizado. Reiniciando el chat...', {
        position: "top-right",
        autoClose: 3000,
      });
      resetChat();
    });
  }, [connected, agentId, addMessage, resetChat]);

  const handleChatClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

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
        onSendMessage={handleSendMessage} // Enviar el mensaje al agente
      />
    </div>
  );
});

Chat.displayName = "Chat";

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
