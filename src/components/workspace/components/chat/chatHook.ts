import { emitWebSocketEvent } from "@services/websocket.service";
import { useCallback, useState } from "react";

export interface Message {
  sender: "user" | "agent";
  text: string;
}

export const useChat = (roomName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() !== "") {
      // Agregar mensaje del usuario localmente
      addMessage({ sender: "user", text: inputValue });
      
      // Emitir el mensaje al backend
      emitWebSocketEvent('message', { sender: 'user', text: inputValue, room: roomName });

      setInputValue("");
    }
  }, [inputValue, roomName, addMessage]);

  return {
    messages,
    inputValue,
    setInputValue,
    addMessage,
    handleSendMessage,
  };
};
