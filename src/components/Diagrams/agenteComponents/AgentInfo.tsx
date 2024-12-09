import { MdEdit, MdAddCircleOutline } from "react-icons/md";
import { useUnifiedNodeCreation } from "../hooks/useUnifiedNodeCreation";
import { useState } from "react";
import { FunctionEditModal } from "../funcionComponents/FunctionEditModal";
import { useFunctionSuccess } from "../hooks/useFunctionActions";

interface AgentData {
  name: string;
  description: string;
}

interface InfoFieldProps {
  label: string;
  value: string | undefined;
  defaultValue: string;
}

const InfoField = ({ label, value, defaultValue }: InfoFieldProps) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700">{label}</h3>
    <p className="mt-1 text-sm text-gray-900">{value || defaultValue}</p>
  </div>
);

interface ActionButtonsProps {
  onEdit: () => void;
  nodeId: string;
  agentId?: number;
}

const ActionButtons = ({ onEdit, nodeId, agentId }: ActionButtonsProps) => {
  const { createWithSpacing } = useUnifiedNodeCreation();
  const [showFunctionModal, setShowFunctionModal] = useState(false);

  const handleFunctionSuccess = useFunctionSuccess(
    createWithSpacing,
    nodeId,
    agentId || -1,
    () => setShowFunctionModal(false)
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={onEdit}
        className="flex items-center justify-center w-full px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
      >
        <MdEdit className="mr-2" /> Editar
      </button>
      <button
        onClick={() => setShowFunctionModal(true)}
        className="flex items-center justify-center w-full px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
      >
        <MdAddCircleOutline className="mr-2" /> Agregar Funciones
      </button>
      {agentId && (
        <FunctionEditModal
          isShown={showFunctionModal}
          onClose={() => setShowFunctionModal(false)}
          onSuccess={handleFunctionSuccess}
          agentId={agentId}
        />
      )}
    </div>
  );
};

interface LoadingStateProps {
  message: string;
}

const LoadingState = ({ message }: LoadingStateProps) => (
  <p className="text-gray-600">{message}</p>
);

interface AgentInfoProps {
  isLoading: boolean;
  agentData: AgentData | null;
  onEdit: () => void;
  nodeId: string;
  agentId?: number;
}

export const AgentInfo = ({
  isLoading,
  agentData,
  onEdit,
  nodeId,
  agentId,
}: AgentInfoProps) => {
  if (isLoading) {
    return <LoadingState message="Cargando información del agente..." />;
  }

  return (
    <div className="space-y-4">
      <InfoField
        label="Nombre"
        value={agentData?.name}
        defaultValue="Sin nombre"
      />
      <InfoField
        label="Descripción"
        value={agentData?.description}
        defaultValue="Sin descripción"
      />
      <ActionButtons onEdit={onEdit} nodeId={nodeId} agentId={agentId} />
    </div>
  );
};
