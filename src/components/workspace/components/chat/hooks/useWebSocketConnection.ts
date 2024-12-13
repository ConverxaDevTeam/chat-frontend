import { useEffect } from "react";
import {
  onWebSocketEvent,
  leaveRoom,
  joinRoom,
  removeWebSocketEvent,
} from "@services/websocket.service";
import { WebSocketChatTestResponse } from "@interfaces/websocket.interface";
import { toast } from "react-toastify";

interface UseWebSocketConnectionProps {
  roomName: string;
  agentId: number | undefined;
  agentIdState: string | undefined;
  threatId: string | undefined;
  setThreatId: (id: string) => void;
  setAgentId: (id: string) => void;
  addMessage: (message: { sender: "user" | "agent"; text: string }) => void;
  resetChat: () => void;
}

export const useWebSocketConnection = ({
  roomName,
  agentId,
  agentIdState,
  threatId,
  setThreatId,
  setAgentId,
  addMessage,
  resetChat,
}: UseWebSocketConnectionProps) => {
  useEffect(() => {
    let connected = false;

    if (!connected) {
      joinRoom(roomName);
      connected = true;
    }

    return () => {
      if (connected) {
        leaveRoom(roomName);
        connected = false;
      }
    };
  }, [roomName]);

  useEffect(() => {
    if (!agentId) return;

    // Escuchar mensajes del agente
    const messageHandler = (response: WebSocketChatTestResponse) => {
      if (threatId !== response.conf.threadId)
        setThreatId(response.conf.threadId);
      if (agentIdState !== response.conf.agentId)
        setAgentId(response.conf.agentId);
      addMessage({
        sender: "agent",
        text: response.text,
      });
    };

    // Escuchar el evento 'typing'
    const typingHandler = (message: string) => {
      addMessage({
        sender: "user",
        text: message,
      });
    };

    // Escuchar el evento 'agent:updated'
    const agentUpdateHandler = () => {
      toast.info("El agente se ha actualizado. Reiniciando el chat...", {
        position: "top-right",
        autoClose: 3000,
      });
      resetChat();
    };

    // Registrar los handlers
    onWebSocketEvent<WebSocketChatTestResponse>("message", messageHandler);
    onWebSocketEvent<string>("typing", typingHandler);
    onWebSocketEvent<void>("agent:updated", agentUpdateHandler);

    return () => {
      // Limpiar los handlers cuando el componente se desmonta
      removeWebSocketEvent("message", messageHandler);
      removeWebSocketEvent("typing", typingHandler);
      removeWebSocketEvent("agent:updated", agentUpdateHandler);
    };
  }, [
    agentId,
    agentIdState,
    threatId,
    setThreatId,
    setAgentId,
    addMessage,
    resetChat,
  ]);
};
