import { memo, useCallback } from "react";
import { useAppSelector } from "@store/hooks";
import { useChat } from "./chatHook";
import { useWebSocketConnection } from "./hooks/useWebSocketConnection";
import { ChatHeader } from "./components/ChatHeader";
import { ChatHistory } from "./components/ChatHistory";
import { ChatFooter } from "./components/ChatFooter";

interface ChatProps {
  onClose?: () => void;
  agentId?: number;
}

const Chat = memo(({ onClose, agentId }: ChatProps) => {
  const userId = useAppSelector(state => state.auth.user?.id);
  const roomName = `test-chat-${userId}`;

  const {
    addMessage,
    messages,
    handleSendMessage,
    setThreatId,
    setLLMAgentId: setAgentId,
    LLMAgentId: agentIdState,
    threatId,
    resetChat,
  } = useChat(roomName, agentId);

  useWebSocketConnection({
    roomName,
    agentId,
    agentIdState,
    threatId,
    setThreatId,
    setAgentId,
    addMessage,
    resetChat,
  });

  const handleChatClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="grid grid-rows-[auto,1fr,auto] max-w-full w-full h-full border-[0.5px] border-sofia-superDark rounded-lg shadow-lg bg-[url('/mvp/background-chats.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full">
        <ChatHeader onClose={handleChatClose} />
      </div>
      <div className="w-full h-full overflow-y-auto">
        <ChatHistory messages={messages} />
      </div>
      <div className="w-full">
        <ChatFooter
          onSendMessage={handleSendMessage}
          conversation={{ id: -1, user: { id: -1 } }}
          user={{ id: userId || 0 }}
        />
      </div>
    </div>
  );
});

Chat.displayName = "Chat";

export default Chat;
