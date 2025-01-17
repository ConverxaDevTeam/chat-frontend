import { Fragment, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Diagram from "@components/Diagrams";
import Chat from "@components/workspace/components/chat/Chat";

interface ChatWrapperProps {
  agentId: number | null;
}

const ChatWrapper = ({ agentId }: ChatWrapperProps) => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <Fragment>
      {isChatVisible ? (
        <div
          className={`relative h-full bg-gray-100 border-l border-gray-300 shadow-lg transition-all duration-300 ${
            isChatVisible ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          {agentId && <Chat onClose={toggleChat} agentId={agentId} />}
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="absolute top-24 right-0 z-50 px-4 py-2 bg-[#15ECDA] text-white rounded-l-full shadow-lg hover:bg-[#15ECDA] focus:outline-none transition-transform"
        >
          <span className="text-sm font-medium">Chat</span>
        </button>
      )}
    </Fragment>
  );
};

const Workspace = () => {
  const [agentId, setAgentId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-[1fr,auto] h-full w-full">
      {/* Diagram Section */}
      <div className="relative w-full h-full p-4">
        {" "}
        {/* Margen agregado */}
        <ReactFlowProvider>
          <Diagram onAgentIdChange={setAgentId} />
        </ReactFlowProvider>
      </div>
      <ChatWrapper agentId={agentId} />
    </div>
  );
};

export default Workspace;
