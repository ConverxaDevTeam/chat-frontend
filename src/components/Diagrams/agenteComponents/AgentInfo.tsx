import { MdEdit, MdAddCircleOutline } from "react-icons/md";

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
}

const ActionButtons = ({ onEdit }: ActionButtonsProps) => (
  <div className="flex gap-2 pt-2">
    <button
      onClick={onEdit}
      className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      <MdEdit className="mr-1" /> Editar
    </button>
    <button
      onClick={() => {
        /* TODO: Implementar agregar funciones */
      }}
      className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
    >
      <MdAddCircleOutline className="mr-1" /> Agregar Funciones
    </button>
  </div>
);

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
}

export const AgentInfo = ({ isLoading, agentData, onEdit }: AgentInfoProps) => {
  if (isLoading) {
    return <LoadingState message="Cargando agente..." />;
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
      <ActionButtons onEdit={onEdit} />
    </div>
  );
};
