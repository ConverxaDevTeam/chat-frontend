import { memo, useState } from "react";
import { MdCode } from "react-icons/md";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps } from "@interfaces/workflow";
import { ActionButtons, FunctionInfo } from "./funcionComponents/FunctionInfo";
import { FunctionEditModal } from "./funcionComponents/FunctionEditModal";
import { ParamsModal } from "./funcionComponents/ParamsModal";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { FunctionParam } from "@interfaces/function-params.interface";
import { useFunctionData } from "./hooks/useFunctionData";
import { useFunctionActions } from "./hooks/useFunctionActions";
import { useReactFlow } from "@xyflow/react";

interface FunctionNodeProps
  extends CustomTypeNodeProps<FunctionData<HttpRequestFunction>> {}

// Funciones de manejo individuales
const handleFunctionSave = async (
  data: FunctionData<HttpRequestFunction>,
  { createFunction, updateFunction }: ReturnType<typeof useFunctionActions>
) => {
  try {
    data.functionId ? await updateFunction(data) : await createFunction(data);
    return true;
  } catch (error) {
    console.error("Error al guardar la función:", error);
    return false;
  }
};

const handleNodeDelete = async (
  id: string,
  deleteFunction: () => Promise<boolean>,
  setNodes: ReturnType<typeof useReactFlow>["setNodes"],
  setEdges: ReturnType<typeof useReactFlow>["setEdges"]
) => {
  try {
    const success = await deleteFunction();
    if (success) {
      setNodes(nodes => nodes.filter(node => node.id !== id));
      setEdges(edges =>
        edges.filter(edge => edge.source !== id && edge.target !== id)
      );
    }
  } catch (error) {
    console.error("Error al eliminar la función:", error);
  }
};

// Hook simplificado para manejar las operaciones del nodo
const useNodeOperations = (
  initialData: FunctionData<HttpRequestFunction>,
  id: string,
  setParams: (params: FunctionParam[]) => void,
  selected: boolean
) => {
  const { setNodes, setEdges } = useReactFlow();
  const actions = useFunctionActions(initialData);
  const { data: functionData } = useFunctionData(
    initialData.functionId,
    selected,
    setParams
  );

  return {
    currentData: functionData || actions.data,
    isLoading: actions.isLoading,
    error: actions.error,
    handleSuccess: (data: FunctionData<HttpRequestFunction>) =>
      handleFunctionSave(data, actions),
    handleDelete: () =>
      handleNodeDelete(id, actions.deleteFunction, setNodes, setEdges),
  };
};

// Componente para los modales
const FunctionModals = ({
  showEdit,
  showParams,
  onEditClose,
  onParamsClose,
  initialData,
  currentData,
  isLoading,
  error,
  params,
  setParams,
  onSuccess,
}: {
  showEdit: boolean;
  showParams: boolean;
  onEditClose: () => void;
  onParamsClose: () => void;
  initialData: FunctionData<HttpRequestFunction>;
  currentData: FunctionData<HttpRequestFunction>;
  isLoading: boolean;
  error: string | null;
  params: FunctionParam[];
  setParams: (params: FunctionParam[]) => void;
  onSuccess: (data: FunctionData<HttpRequestFunction>) => void;
}) => (
  <>
    <FunctionEditModal
      isShown={showEdit}
      onClose={onEditClose}
      functionId={initialData.functionId}
      initialData={currentData}
      onSuccess={onSuccess}
      isLoading={isLoading}
      error={error}
      agentId={initialData.agentId}
    />
    <ParamsModal
      isShown={showParams}
      onClose={onParamsClose}
      functionData={{
        id: initialData.functionId || 0,
        requestBody: initialData.config?.requestBody,
      }}
      params={params}
      setParams={setParams}
    />
  </>
);

// Componente para el contenido del nodo
const NodeContent = ({
  currentData,
  params,
  onEditClick,
  onParamsClick,
  onDelete,
}: {
  currentData: FunctionData<HttpRequestFunction>;
  params: FunctionParam[];
  onEditClick: () => void;
  onParamsClick: () => void;
  onDelete: () => void;
}) => (
  <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
    <FunctionInfo functionData={currentData} />
    <ActionButtons
      onEdit={onEditClick}
      onParamsClick={onParamsClick}
      onDelete={onDelete}
      params={params}
    />
  </div>
);

const FuncionNode = memo((props: FunctionNodeProps) => {
  const { data: initialData, selected, id } = props;
  const [showEditModal, setShowEditModal] = useState(!initialData.functionId);
  const [showParamsModal, setShowParamsModal] = useState(false);
  const [params, setParams] = useState<FunctionParam[]>([]);

  const handleShowParamsModal = () => {
    setShowParamsModal(true);
  };

  const handleCloseParamsModal = () => {
    setShowParamsModal(false);
  };

  const { currentData, isLoading, error, handleSuccess, handleDelete } =
    useNodeOperations(initialData, id, setParams, selected ?? false);

  return (
    <>
      <DefaultNode
        {...props}
        allowedConnections={["source", "target"]}
        icon={<MdCode size={20} className="text-gray-700" />}
      >
        <NodeContent
          currentData={currentData}
          params={params}
          onEditClick={() => setShowEditModal(true)}
          onParamsClick={handleShowParamsModal}
          onDelete={handleDelete}
        />
      </DefaultNode>

      <FunctionModals
        showEdit={showEditModal}
        showParams={showParamsModal}
        onEditClose={() => setShowEditModal(false)}
        onParamsClose={handleCloseParamsModal}
        initialData={initialData}
        currentData={currentData}
        isLoading={isLoading}
        error={error}
        params={params}
        setParams={setParams}
        onSuccess={async data => {
          const success = await handleSuccess(data);
          if (success) setShowEditModal(false);
        }}
      />
    </>
  );
});

export default FuncionNode;
