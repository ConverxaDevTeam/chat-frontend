import { emitWebSocketEvent } from "@services/websocket.service";
import { useCallback, useState } from "react";
import {
  ChatAgentIdentifier,
  TestAgentIdentifier,
  AgentIdentifierType,
  AgenteType,
} from "@interfaces/agents";
import { useAppSelector } from "@store/hooks";

export interface Message {
  sender: "user" | "agent";
  text: string;
  images?: string[];
  threat_id?: string;
}

export const useChat = (roomName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threatId, setThreatId] = useState<string | undefined>();
  const [LLMAgentId, setLLMAgentId] = useState<string | undefined>();
  const agentId = useAppSelector(state => state.chat.currentAgent?.id);

  const resetChat = useCallback(() => {
    setMessages([]);
    setThreatId(undefined);
    setLLMAgentId(undefined);
  }, []);
  if (!agentId) throw new Error("No se ha seleccionado un agente");

  const addMessage = useCallback((message: Message) => {
    // Si el mensaje es del agente y tiene identificador de test, guardamos los datos
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  const handleSendMessage = useCallback(
    (val: string, images?: string[]) => {
      if (!val.trim() && !images?.length) return;
      let identifier: ChatAgentIdentifier | TestAgentIdentifier;
      if (messages.length === 0) {
        identifier = {
          agentId: agentId,
          type: AgentIdentifierType.CHAT_TEST,
        } as ChatAgentIdentifier;
      } else {
        identifier = {
          type: AgentIdentifierType.TEST,
          threatId: threatId,
          LLMAgentId: LLMAgentId,
          agentId: agentId,
          agent: AgenteType.SOFIA_ASISTENTE,
        } as TestAgentIdentifier;
      }

      emitWebSocketEvent("message", {
        text: val,
        images,
        room: roomName,
        identifier,
      });
    },
    [roomName, addMessage, messages.length, threatId, LLMAgentId]
  );

  return {
    messages,
    addMessage,
    handleSendMessage,
    setThreatId,
    setLLMAgentId,
    threatId,
    LLMAgentId,
    resetChat,
  };
};
