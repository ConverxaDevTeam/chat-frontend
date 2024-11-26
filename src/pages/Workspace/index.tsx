import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { BsChatDotsFill } from "react-icons/bs"; // Icono del chat
import Diagram from "@components/Diagrams";
import Chat from "@components/workspace/components/chat/Chat";

export const Workspace = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] h-full">
      {/* Chat Column */}
      <div
        className={`transition-transform duration-300 ease-in-out ${
          isChatVisible ? "w-64 md:w-80" : "w-0"
        } overflow-hidden`}
      >
        {isChatVisible && <Chat />}
      </div>

      {/* Main Diagram */}
      <div className="relative w-full h-full">
        <ReactFlowProvider>
          <Diagram />
        </ReactFlowProvider>
        {/* Botón flotante para abrir el chat */}
        <button
          onClick={toggleChat}
          className="fixed bottom-4 left-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none md:hidden"
        >
          <BsChatDotsFill size={24} />
        </button>
      </div>
    </div>
  );
};

export default Workspace;
