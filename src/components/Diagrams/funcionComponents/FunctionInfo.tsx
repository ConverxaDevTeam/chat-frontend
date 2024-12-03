import { MdEdit } from "react-icons/md";

interface FunctionInfoProps {
  isLoading?: boolean;
  functionData?: {
    name: string;
    description: string;
    type?: string;
  };
  onEdit: () => void;
}

const LoadingState = ({ message = "Cargando..." }) => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-3/4">{message}</div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
  </div>
);

const InfoField = ({
  label,
  value,
  defaultValue = "No especificado",
}: {
  label: string;
  value?: string;
  defaultValue?: string;
}) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700">{label}</h3>
    <p className="mt-1 text-sm text-gray-900">{value || defaultValue}</p>
  </div>
);

const ActionButtons = ({ onEdit }: { onEdit: () => void }) => {
  return (
    <div className="grid gap-2 w-full">
      <button
        onClick={onEdit}
        className="flex items-center justify-center w-full px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
      >
        <MdEdit className="mr-2" /> Editar
      </button>
    </div>
  );
};

export const FunctionInfo = ({
  isLoading,
  functionData,
  onEdit,
}: FunctionInfoProps) => {
  if (isLoading) {
    return <LoadingState message="Cargando función..." />;
  }

  const fields = [
    {
      label: "Nombre",
      value: functionData?.name,
      defaultValue: "Sin nombre",
    },
    {
      label: "Descripción",
      value: functionData?.description,
      defaultValue: "Sin descripción",
    },
    {
      label: "Tipo",
      value:
        functionData?.type === "API_REQUEST"
          ? "API Request"
          : functionData?.type,
      defaultValue: "No especificado",
    },
  ];

  return (
    <div className="grid gap-4">
      {fields.map(field => (
        <InfoField
          key={field.label}
          label={field.label}
          value={field.value}
          defaultValue={field.defaultValue}
        />
      ))}
      <ActionButtons onEdit={onEdit} />
    </div>
  );
};
