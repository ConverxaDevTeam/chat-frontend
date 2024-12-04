import { memo, useState } from "react";
import { MdCode } from "react-icons/md";
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

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const useParams = (initialParams: FunctionParam[] = []) => {
  const [params, setParams] = useState<FunctionParam[]>(initialParams);

  const addParam = (param: FunctionParam) => {
    setParams([...params, { ...param, id: crypto.randomUUID() }]);
    // TODO: Implement save params to backend
  };

  const editParam = (param: FunctionParam) => {
    setParams(params.map(p => (p.id === param.id ? param : p)));
    // TODO: Implement save params to backend
  };

  const deleteParam = (paramId: string) => {
    setParams(params.filter(p => p.id !== paramId));
    // TODO: Implement save params to backend
  };

  return { params, addParam, editParam, deleteParam };
};

const FuncionNode = memo(
  (props: CustomTypeNodeProps<FunctionData<HttpRequestFunction>>) => {
    const { data: initialData, selected } = props;
    const editModal = useModal(!initialData.functionId);
    const paramsModal = useModal();
    const { params } = useParams(initialData.config?.requestBody || []);
    const { data, isLoading, error, createFunction, updateFunction } =
      useFunctionActions(initialData);
    const { data: functionData } = useFunctionData(
      initialData.functionId,
      selected ?? false
    );

    // Usar los datos más actualizados
    const currentData = functionData || data;

    const handleSuccess = async (
      functionData: FunctionData<HttpRequestFunction>
    ) => {
      try {
        if (functionData.functionId) {
          await updateFunction(functionData);
        } else {
          await createFunction(functionData);
        }
        editModal.close();
      } catch (error) {
        console.error("Error al guardar la función:", error);
      }
    };

    return (
      <>
        <DefaultNode
          {...props}
          icon={<MdCode size={24} className="w-8 h-8 text-gray-800" />}
          allowedConnections={["source", "target"]}
        >
          <div className="grid gap-4 p-4 bg-white rounded-md shadow-lg">
            <FunctionInfo functionData={currentData} onEdit={editModal.open} />
            <button
              onClick={paramsModal.open}
              className="w-full px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Ver Parámetros ({params.length})
            </button>
          </div>
        </DefaultNode>

        <FunctionEditModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          functionId={initialData.functionId}
          initialData={currentData || initialData}
          onSuccess={handleSuccess}
          isLoading={isLoading}
          error={error}
          agentId={initialData.agentId}
        />

        <ParamsModal
          isOpen={paramsModal.isOpen}
          onClose={paramsModal.close}
          params={params}
        />
      </>
    );
  }
);

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
