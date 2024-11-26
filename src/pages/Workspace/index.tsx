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
      <div className="relative w-full h-full">
        <ReactFlowProvider>
          <Diagram />
        </ReactFlowProvider>
      </div>
      {isChatVisible ? (
      <div
        className={`h-full bg-gray-100 border-l ml-4 border-gray-300 shadow-lg transition-all duration-300 ${
          isChatVisible ? "w-80" : "w-0"
        } overflow-hidden`}
      >
        {isChatVisible && <Chat />}
      </div>) : (

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
