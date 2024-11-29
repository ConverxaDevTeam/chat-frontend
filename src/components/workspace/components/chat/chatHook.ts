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
  const [threat_id, setThreatId] = useState<string | undefined>();
  
  const chatId = useAppSelector((state) => state.chat.chat?.id);

  const addMessage = useCallback((message: Message,) => {
    // Si el mensaje es del agente y tiene identificador de test, guardamos los datos
    setThreatId(message.threat_id);
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() === "") return;
    let identifier: ChatAgentIdentifier | TestAgentIdentifier;
    
    if (messages.length === 0) {
      // Primer mensaje: usar ChatAgentIdentifier
      identifier = {
        chat_id: chatId,
        type: AgentIdentifierType.CHAT
      } as ChatAgentIdentifier;
    } else {
      identifier = {
        type: AgentIdentifierType.TEST,
        threat_id: threat_id,
        agent: AgenteType.SOFIA_ASISTENTE
      } as TestAgentIdentifier;
    }

    emitWebSocketEvent("message", { text: inputValue, room: roomName, identifier });
    setInputValue("");
  }, [inputValue, roomName, addMessage, messages.length, chatId, threat_id]);

  return {
    messages,
    inputValue,
    setInputValue,
    addMessage,
    handleSendMessage,
    chatId,
    setThreatId,
    threat_id
  };
};
