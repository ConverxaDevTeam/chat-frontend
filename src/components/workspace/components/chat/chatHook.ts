import { emitWebSocketEvent } from "@services/websocket.service";
import { useCallback, useState } from "react";
import { ChatAgentIdentifier, TestAgentIdentifier, AgentIdentifierType, AgenteType } from "@interfaces/agents";
import { useAppSelector } from "@store/hooks";

export interface Message {
  sender: "user" | "agent";
  text: string;
  threat_id?: string;
}

export const useChat = (roomName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [threatId, setThreatId] = useState<string | undefined>();
  const [agentId, setAgentId] = useState<string | undefined>();
  
  const chatId = useAppSelector((state) => state.chat.chat?.id);

  const resetChat = useCallback(() => {
    setMessages([]);
    setThreatId(undefined);
    setAgentId(undefined);
  }, []);

  const addMessage = useCallback((message: Message,) => {
    // Si el mensaje es del agente y tiene identificador de test, guardamos los datos
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() === "") return;
    let identifier: ChatAgentIdentifier | TestAgentIdentifier;
    if (messages.length === 0) {
      // Primer mensaje: usar ChatAgentIdentifier
      identifier = {
        chatId: chatId,
        type: AgentIdentifierType.CHAT_TEST
      } as ChatAgentIdentifier;
    } else {
      identifier = {
        type: AgentIdentifierType.TEST,
        threatId: threatId,
        agentId: agentId,
        agent: AgenteType.SOFIA_ASISTENTE
      } as TestAgentIdentifier;
    }

    emitWebSocketEvent("message", { text: inputValue, room: roomName, identifier });
    setInputValue("");
  }, [inputValue, roomName, addMessage, messages.length, chatId, threatId, agentId]);

  return {
    messages,
    inputValue,
    setInputValue,
    addMessage,
    handleSendMessage,
    chatId,
    setThreatId,
    setAgentId,
    threatId,
    agentId,
    resetChat
  };
};
