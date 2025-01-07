import { memo, useState } from "react";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps } from "@interfaces/workflow";
import { contextMenuOptions } from "./funcionComponents/FunctionInfo";
import { FunctionEditModal } from "./funcionComponents/FunctionEditModal";
import { ParamsModal } from "./funcionComponents/ParamsModal";
import { TestFunctionModal } from "./funcionComponents/TestFunctionModal";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { FunctionParam } from "@interfaces/function-params.interface";
import { useFunctionData } from "./hooks/useFunctionData";
import { useFunctionActions } from "./hooks/useFunctionActions";
import { useReactFlow } from "@xyflow/react";
import { functionsService } from "@services/functions.service";

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
  const { data: functionData, setData } = useFunctionData(
    initialData.functionId,
    selected,
    setParams
  );

  return {
    currentData: functionData || actions.data,
    isLoading: actions.isLoading,
    error: actions.error,
    handleSuccess: async (data: FunctionData<HttpRequestFunction>) => {
      const saved = await handleFunctionSave(data, actions);
      if (saved) setData(data);
      return saved;
    },
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

const FuncionNode = memo((props: FunctionNodeProps) => {
  const { data: initialData, id, selected } = props;
  if (!initialData.functionId) {
    console.error("FuncionNode requires a functionId");
    return null;
  }
  const [showEditModal, setShowEditModal] = useState(false);
  const [showParamsModal, setShowParamsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [params, setParams] = useState<FunctionParam[]>([]);

  const handleShowParamsModal = () => setShowParamsModal(true);
  const handleCloseParamsModal = () => setShowParamsModal(false);

  const { currentData, isLoading, error, handleSuccess, handleDelete } =
    useNodeOperations(initialData, id, setParams, selected ?? false);

  const handleTestEndpoint = () => {
    setShowTestModal(true);
  };

  const handleTest = async (params: Record<string, unknown>) => {
    return await functionsService.testEndpoint(initialData.functionId!, params);
  };

  return (
    <>
      <DefaultNode
        {...props}
        allowedConnections={["source", "target"]}
        icon={<img src="/mvp/square-code.svg" className="w-8 h-8" />}
        contextMenuOptions={contextMenuOptions({
          params,
          onEdit: () => setShowEditModal(true),
          onParamsClick: handleShowParamsModal,
          onDelete: handleDelete,
          onTestEndpoint: handleTestEndpoint,
        })}
      ></DefaultNode>

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
      {showTestModal && (
        <TestFunctionModal
          isShown={showTestModal}
          onClose={() => setShowTestModal(false)}
          onTest={handleTest}
          params={params}
        />
      )}
    </>
  );
});

export default FuncionNode;
