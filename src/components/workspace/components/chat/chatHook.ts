import { emitWebSocketEvent } from "@services/websocket.service";
import { useCallback, useState } from "react";
import { AgentIdentifier, ChatAgentIdentifier, TestAgentIdentifier, AgenteType, AgentIdentifierType } from "@interfaces/agents";
import { useAppSelector } from "@store/hooks";

export interface Message {
  sender: "user" | "agent";
  text: string;
  identifier?: AgentIdentifier;
}

export const useChat = (roomName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [testAgent, setTestAgent] = useState<AgenteType | undefined>();
  const [testThreatId, setTestThreatId] = useState<string | undefined>();
  
  const chatId = useAppSelector((state) => state.chat.chat?.id);

  const addMessage = useCallback((message: Message) => {
    // Si el mensaje es del agente y tiene identificador de test, guardamos los datos
    if (message.sender === 'agent' && message.identifier?.type === 'test') {
      const testIdentifier = message.identifier as TestAgentIdentifier;
      setTestAgent(testIdentifier.agent);
      setTestThreatId(testIdentifier.threat_id);
    }
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
        type: 'test',
        agent: testAgent,
        threat_id: testThreatId
      } as TestAgentIdentifier;
    }

    emitWebSocketEvent("message", { text: inputValue, room: roomName, identifier });
    setInputValue("");
  }, [inputValue, roomName, addMessage, messages.length, chatId, testAgent, testThreatId]);

  return {
    messages,
    inputValue,
    setInputValue,
    addMessage,
    handleSendMessage,
    chatId
  };
};
