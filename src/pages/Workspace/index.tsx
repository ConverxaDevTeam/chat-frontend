import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Diagram from "@components/Diagrams";
import Chat from "@components/workspace/components/chat/Chat";

const Workspace = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="grid grid-cols-[1fr,auto] h-full w-full">
      {/* Diagram Section */}
      <div className="relative w-full h-full p-4"> {/* Margen agregado */}
        <ReactFlowProvider>
          <Diagram />
        </ReactFlowProvider>
      </div>

      {/* Chat Section */}
      <div
        className={`relative h-full bg-gray-100 border-l border-gray-300 shadow-lg transition-all duration-300 ${
          isChatVisible ? "w-80" : "w-0"
        } overflow-hidden`}
      >
        {/* Chat Content */}
        {isChatVisible && <Chat />}
      </div>

      {/* Toggle Button */}
      {!isChatVisible && (
        <button
          onClick={toggleChat}
          className="absolute top-24 right-0 z-50 px-4 py-2 bg-blue-500 text-white rounded-l-full shadow-lg hover:bg-blue-600 focus:outline-none transition-transform"
        >
          <span className="text-sm font-medium">Chat</span>
        </button>
      )}
    </div>
  );
};

export default Workspace;
