import { useUnifiedNodeCreation } from "../hooks/useUnifiedNodeCreation";
import { FunctionEditModal } from "../funcionComponents/FunctionEditModal";
import { useFunctionSuccess } from "../hooks/useFunctionActions";
import KnowledgeBaseModal from "./KnowledgeBaseModal";
import { AgentEditModal } from "./AgentEditModal";
import { useAgentData } from "../hooks/useAgentData";
import { useAlertContext } from "../components/AlertContext";

export enum ActionType {
  EDIT_AGENT = "EDIT_AGENT",
  ADD_FUNCTION = "ADD_FUNCTION",
  ADD_DOCUMENT = "ADD_DOCUMENT",
  SEND_TO_HUMAN = "SEND_TO_HUMAN",
  ADD_APPLICATION = "ADD_APPLICATION",
}

interface ActionButtonsProps {
  eventShown: string | null;
  onClose: () => void;
  agentId: number;
  nodeId: string;
  selected?: boolean;
}

export const ActionButtons = ({
  eventShown,
  onClose,
  agentId,
  nodeId,
  selected,
}: ActionButtonsProps) => {
  const { agentData, refreshAgentData } = useAgentData(
    agentId,
    selected ?? false
  );

  const { createWithSpacing } = useUnifiedNodeCreation();

  const handleEditSuccess = () => {
    onClose();
    refreshAgentData();
  };
  const { handleOperation } = useAlertContext();

  const handleFunctionSuccess = useFunctionSuccess(
    createWithSpacing,
    nodeId,
    agentId || -1,
    () => onClose(),
    handleOperation
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {agentId && (
        <>
          <FunctionEditModal
            isShown={eventShown === ActionType.ADD_FUNCTION}
            onClose={onClose}
            onSuccess={handleFunctionSuccess}
            agentId={agentId}
          />
          <KnowledgeBaseModal
            isShown={eventShown === ActionType.ADD_DOCUMENT}
            onClose={onClose}
            agentId={agentId}
          />
          <AgentEditModal
            isOpen={eventShown === ActionType.EDIT_AGENT}
            onClose={onClose}
            agentId={agentId}
            initialData={agentData || undefined}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </div>
  );
};
