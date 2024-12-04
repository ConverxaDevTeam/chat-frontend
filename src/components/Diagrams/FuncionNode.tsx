import { memo, useState, useCallback } from "react";
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
import { functionsService } from "@services/functions.service";
import { useSweetAlert } from "../../hooks/useSweetAlert";

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

const useFunctionActions = (initialData: FunctionData<HttpRequestFunction>) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleOperation, showConfirmation } = useSweetAlert();

  const handleCreate = useCallback(
    async (functionData: FunctionData<HttpRequestFunction>) => {
      try {
        setIsLoading(true);
        setError(null);

        // Asegurarse de que el agentId se mantenga del nodo inicial
        const dataToSend = {
          ...functionData,
          agentId: initialData.agentId,
        };

        const result = await handleOperation(
          () => functionsService.create(dataToSend),
          {
            title: "Creando función",
            successTitle: "¡Función creada!",
            successText: "La función se ha creado exitosamente",
            errorTitle: "Error al crear la función",
          }
        );

        if (result.success && result.data) {
          setData(result.data);
          return result.data;
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [initialData.agentId]
  );

  const handleUpdate = useCallback(
    async (functionData: Partial<FunctionData<HttpRequestFunction>>) => {
      if (!data.functionId) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await handleOperation(
          () => functionsService.update(data.functionId!, functionData),
          {
            title: "Actualizando función",
            successTitle: "¡Función actualizada!",
            successText: "La función se ha actualizado exitosamente",
            errorTitle: "Error al actualizar la función",
          }
        );

        if (result.success && result.data) {
          setData(result.data);
          return result.data;
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [data.functionId]
  );

  const handleDelete = useCallback(async () => {
    if (!data.functionId) return;

    try {
      const confirmed = await showConfirmation({
        title: "¿Eliminar función?",
        text: "¿Estás seguro de que deseas eliminar esta función? Esta acción no se puede deshacer.",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmed) {
        return false;
      }

      setIsLoading(true);
      setError(null);

      const result = await handleOperation(
        () => functionsService.delete(data.functionId!),
        {
          title: "Eliminando función",
          successTitle: "¡Función eliminada!",
          successText: "La función se ha eliminado exitosamente",
          errorTitle: "Error al eliminar la función",
        }
      );

      return result.success;
    } finally {
      setIsLoading(false);
    }
  }, [data.functionId]);

  return {
    data,
    isLoading,
    error,
    createFunction: handleCreate,
    updateFunction: handleUpdate,
    deleteFunction: handleDelete,
  };
};

const FuncionNode = memo(
  (props: CustomTypeNodeProps<FunctionData<HttpRequestFunction>>) => {
    const { data: initialData } = props;
    const editModal = useModal(!initialData.functionId);
    const paramsModal = useModal();
    const { params, addParam, editParam, deleteParam } = useParams(
      initialData.config?.requestBody || []
    );
    const { data, isLoading, error, createFunction, updateFunction } =
      useFunctionActions(initialData);

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
            <FunctionInfo functionData={data} onEdit={editModal.open} />
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
          functionId={data.functionId}
          initialData={data}
          onSuccess={handleSuccess}
          isLoading={isLoading}
          error={error}
          agentId={data.agentId}
        />

        <ParamsModal
          isOpen={paramsModal.isOpen}
          onClose={paramsModal.close}
          params={params}
          onParamAdd={addParam}
          onParamEdit={editParam}
          onParamDelete={deleteParam}
        />
      </>
    );
  }
);

FuncionNode.displayName = "FuncionNode";
export default FuncionNode;
