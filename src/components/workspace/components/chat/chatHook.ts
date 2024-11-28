import { useState } from "react";

export interface Message {
  sender: "user" | "agent";
  text: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const simulateAgentResponse = () => {
    setTimeout(() => {
      addMessage({ sender: "agent", text: "Esta es una respuesta automática del agente." });
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    addMessage({ sender: "user", text: inputValue });
    setInputValue("");

    // Simular respuesta del agente
    simulateAgentResponse();
  };

  return {
    messages,
    inputValue,
    setInputValue,
    addMessage,
    simulateAgentResponse,
    handleSendMessage,
  };
};
