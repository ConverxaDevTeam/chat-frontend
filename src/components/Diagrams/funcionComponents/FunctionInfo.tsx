import { MdDelete, MdEdit, MdPlayArrow } from "react-icons/md";

interface FunctionInfoProps {
  isLoading?: boolean;
  functionData?: {
    name: string;
    description: string;
    type?: string;
  };
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

interface ActionButtonsProps {
  params: { name: string; type: string }[];
  onEdit: () => void;
  onParamsClick: () => void;
  onDelete: () => void;
  onTestEndpoint: () => void;
}

export const contextMenuOptions = ({
  params,
  onEdit,
  onParamsClick,
  onDelete,
  onTestEndpoint,
}: ActionButtonsProps) => [
  {
    child: <img src="/mvp/pencil.svg" alt="Editar función" />,
    onClick: onEdit,
    tooltip: "Editar función",
  },
  {
    child: <img src="/mvp/variable.svg" alt="Ver parámetros" />,
    onClick: onParamsClick,
    tooltip: `Ver Parámetros (${params.length})`,
  },
  {
    child: <img src="/mvp/play.svg" alt="Probar endpoint" />,
    onClick: onTestEndpoint,
    tooltip: "Probar endpoint",
  },
  {
    child: <img src="/mvp/trash.svg" alt="Eliminar función" />,
    onClick: onDelete,
    tooltip: "Eliminar función",
  },
];

export const FunctionInfo = ({
  isLoading,
  functionData,
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
    </div>
  );
};
