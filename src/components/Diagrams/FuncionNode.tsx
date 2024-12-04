import { memo, useState } from "react";
import { MdCode, MdDelete } from "react-icons/md";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps } from "@interfaces/workflow";
import { FunctionInfo } from "./funcionComponents/FunctionInfo";
import { FunctionEditModal } from "./funcionComponents/FunctionEditModal";
import { ParamsModal } from "./funcionComponents/ParamsModal";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { FunctionParam } from "@interfaces/function-params.interface";
import { useFunctionData } from "./hooks/useFunctionData";
import { useFunctionActions } from "./hooks/useFunctionActions";

// Tipos
interface FunctionNodeProps
  extends CustomTypeNodeProps<FunctionData<HttpRequestFunction>> {}

interface FunctionHandlersProps {
  functionData: FunctionData<HttpRequestFunction>;
  createFunction: (
    data: FunctionData<HttpRequestFunction>
  ) => Promise<FunctionData<HttpRequestFunction> | null>;
  updateFunction: (
    data: Partial<FunctionData<HttpRequestFunction>>
  ) => Promise<FunctionData<HttpRequestFunction> | null | undefined>;
  onSuccess: () => void;
}

interface ModalsProps {
  editModal: {
    isOpen: boolean;
    onClose: () => void;
  };
  paramsModal: {
    isOpen: boolean;
    onClose: () => void;
  };
  functionData: FunctionData<HttpRequestFunction>;
  initialData: FunctionData<HttpRequestFunction>;
  isLoading: boolean;
  error: string | null;
  params: FunctionParam[];
  onSuccess: (data: FunctionData<HttpRequestFunction>) => void;
}

// Hook para manejar modales
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  return {
    isOpen,
    open: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
  };
};

// Hook para manejar parámetros
const useParams = (initialParams: FunctionParam[] = []) => {
  const [params, setParams] = useState<FunctionParam[]>(initialParams);

  const addParam = (param: FunctionParam) => {
    setParams([...params, { ...param, id: crypto.randomUUID() }]);
  };

  const editParam = (param: FunctionParam) => {
    setParams(params.map(p => (p.id === param.id ? param : p)));
  };

  const deleteParam = (paramId: string) => {
    setParams(params.filter(p => p.id !== paramId));
  };

  return { params, addParam, editParam, deleteParam };
};

// Componente para el botón de eliminar
const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
    title="Eliminar función"
  >
    <MdDelete size={20} />
  </button>
);

// Componente para el contenido del nodo
const NodeContent = ({
  functionData,
  params,
  onEditClick,
  onParamsClick,
}: {
  functionData: FunctionData<HttpRequestFunction>;
  params: FunctionParam[];
  onEditClick: () => void;
  onParamsClick: () => void;
}) => (
  <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
    <FunctionInfo functionData={functionData} onEdit={onEditClick} />
    <button
      onClick={onParamsClick}
      className="w-full px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
    >
      Ver Parámetros ({params.length})
    </button>
  </div>
);

// Componente para los handlers de función
const useFunctionHandlers = ({
  createFunction,
  updateFunction,
  onSuccess,
}: FunctionHandlersProps) => {
  const handleSuccess = async (data: FunctionData<HttpRequestFunction>) => {
    try {
      if (data.functionId) {
        await updateFunction(data);
      } else {
        await createFunction(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar la función:", error);
    }
  };

  return { handleSuccess };
};

// Componente para los modales
const Modals = ({
  editModal,
  paramsModal,
  functionData,
  initialData,
  isLoading,
  error,
  params,
  onSuccess,
}: ModalsProps) => (
  <>
    <FunctionEditModal
      isOpen={editModal.isOpen}
      onClose={editModal.onClose}
      functionId={initialData.functionId}
      initialData={functionData}
      onSuccess={onSuccess}
      isLoading={isLoading}
      error={error}
      agentId={initialData.agentId}
    />
    <ParamsModal
      isOpen={paramsModal.isOpen}
      onClose={paramsModal.onClose}
      params={params}
    />
  </>
);

// Componente principal
const FuncionNode = memo((props: FunctionNodeProps) => {
  const { data: initialData, selected } = props;

  // Hooks
  const editModal = useModal(!initialData.functionId);
  const paramsModal = useModal();
  const { params } = useParams(initialData.config?.requestBody || []);
  const {
    data,
    isLoading,
    error,
    createFunction,
    updateFunction,
    deleteFunction,
  } = useFunctionActions(initialData);
  const { data: functionData } = useFunctionData(
    initialData.functionId,
    selected ?? false
  );

  // Datos actualizados
  const currentData = functionData || data;

  // Handlers
  const { handleSuccess } = useFunctionHandlers({
    functionData: currentData,
    createFunction,
    updateFunction,
    onSuccess: editModal.onClose,
  });

  const handleDelete = async () => {
    try {
      const success = await deleteFunction();
      if (success) {
        console.log("Función eliminada exitosamente");
      }
    } catch (error) {
      console.error("Error al eliminar la función:", error);
    }
  };

  return (
    <>
      <DefaultNode
        {...props}
        allowedConnections={["source", "target"]}
        icon={<MdCode size={20} className="text-gray-700" />}
        headerActions={selected && <DeleteButton onClick={handleDelete} />}
      >
        <NodeContent
          functionData={currentData}
          params={params}
          onEditClick={editModal.open}
          onParamsClick={paramsModal.open}
        />
      </DefaultNode>

      <Modals
        editModal={editModal}
        paramsModal={paramsModal}
        functionData={currentData}
        initialData={initialData}
        isLoading={isLoading}
        error={error}
        params={params}
        onSuccess={handleSuccess}
      />
    </>
  );
});

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
