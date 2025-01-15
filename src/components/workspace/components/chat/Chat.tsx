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
    <div className="grid grid-rows-[auto,1fr,auto] w-full h-full bg-gray-100 border-r border-gray-300 shadow-lg">
      <ChatHeader onClose={handleChatClose} />
      <ChatHistory messages={messages} />
      <ChatFooter
        onSendMessage={handleSendMessage}
        conversation={{ id: -1, user: { id: -1 } }}
        user={{ id: userId || 0 }}
      />
    </div>
  );
});

Chat.displayName = "Chat";

export default Chat;
