import { useEffect, useRef, useState } from "react";
import MessageSofia from "./MessageSofia";
import MessageUser from "./MessageUser";
import { ConfigWebChat } from "../CustomizeChat";
import { IConversation } from "@utils/interfaces";

interface ChatProps {
  config: ConfigWebChat;
  conversation: IConversation;
}

const Chat = ({ config, conversation }: ChatProps) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    // Mover el scroll hacia el final del contenedor cuando cambian los mensajes
    scrollToBottom();
  }, [conversation?.messages?.length]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
    setText("");
  };

  return (
    <>
      <div
        className="flex flex-col flex-1 overflow-y-auto pt-[10px] px-[20px] gap-[10px]"
        style={{
          backgroundColor: config.bg_chat,
        }}
      >
        {conversation?.messages &&
          conversation.messages.map(message => {
            return message.type === "agent" ? (
              <MessageSofia
                key={`chat-msg-${message.id}`}
                menssage={message}
                config={config}
              />
            ) : (
              <MessageUser
                key={`chat-msg-${message.id}`}
                menssage={message}
                config={config}
              />
            );
          })}
        <div ref={messagesEndRef}></div>
      </div>
      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            backgroundColor: config.button_color,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </form>
    </>
  );
};

export default Chat;
