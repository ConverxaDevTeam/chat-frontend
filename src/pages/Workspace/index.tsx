import { Fragment, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Diagram from "@components/Diagrams";
import Chat from "@components/workspace/components/chat/Chat";
import DepartmentTabs from "@components/Interface/Navbar/DepartmentTabs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@store";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { ApplicationsSidebar } from "@components/ApplicationsSidebar";
import {
  ApplicationsSidebarProvider,
  useApplicationsSidebar,
} from "@hooks/ApplicationsSidebarContext";

interface ChatWrapperProps {
  agentId: number;
}

const ChatWrapper = ({ agentId }: ChatWrapperProps) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { selectedDepartmentId } = useSelector(
    (state: RootState) => state.department
  );
  const navigate = useNavigate();
  const { showConfirmation } = useAlertContext();

  const toggleChat = async () => {
    if (!selectedDepartmentId) {
      const confirmed = await showConfirmation({
        title: "Seleccionar Departamento",
        text: "Es necesario seleccionar un departamento para usar el chat. Si no existe uno, puedes crearlo en la sección de departamentos.",
        confirmButtonText: "Ir a departamentos",
        cancelButtonText: "Permanecer aquí",
      });
      if (confirmed) {
        navigate("/departments");
      }
      return;
    }
    setIsChatVisible(!isChatVisible);
  };

  return (
    <Fragment>
      {isChatVisible ? (
        <div
          className={`relative h-full bg-gray-100 border-gray-300 shadow-lg transition-all duration-300 ml-2 ${
            isChatVisible ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          {agentId && <Chat onClose={toggleChat} agentId={agentId} />}
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="absolute w-[56px] h-[40px] top-19 right-5 flex items-center justify-center border border-sofia-navyBlue bg-sofia-superDark rounded-lg shadow-lg focus:outline-none transition-transform"
        >
          <img src="/mvp/messages-square-white.svg" alt="Chat-icon" />
        </button>
      )}
    </Fragment>
  );
};

const ApplicationsWrapper = ({ agentId }: { agentId: number }) => {
  const { isApplicationsSidebarOpen, closeApplicationsSidebar } =
    useApplicationsSidebar();

  return (
    <Fragment>
      {isApplicationsSidebarOpen && (
        <ApplicationsSidebar
          onClose={closeApplicationsSidebar}
          agentId={agentId}
        />
      )}
    </Fragment>
  );
};

const WorkspaceContent = () => {
  const [agentId, setAgentId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-[1fr,auto] h-full w-full">
      {/* Diagram Section */}
      <div className="relative w-full h-full">
        {/* Margen agregado */}
        <div className="w-full h-full">
          <ReactFlowProvider>
            <Diagram onAgentIdChange={setAgentId} />
          </ReactFlowProvider>
        </div>
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <DepartmentTabs />
        </div>
      </div>
      {agentId !== null && <ChatWrapper agentId={agentId} />}
      <ApplicationsWrapper agentId={agentId || -1} />
    </div>
  );
};

const Workspace = () => {
  return (
    <ApplicationsSidebarProvider>
      <WorkspaceContent />
    </ApplicationsSidebarProvider>
  );
};

export default Workspace;
