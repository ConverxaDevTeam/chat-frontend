import { useState, useCallback } from "react";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { functionsService } from "@services/functions.service";
import { useSweetAlert } from "../../../hooks/useSweetAlert";

// Hook para manejar el estado de la función
const useFunctionState = (initialData: FunctionData<HttpRequestFunction>) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => setError(null), []);
  const setLoadingState = useCallback(
    (loading: boolean) => setIsLoading(loading),
    []
  );
  const updateData = useCallback(
    (newData: FunctionData<HttpRequestFunction>) => setData(newData),
    []
  );

  return {
    data,
    isLoading,
    error,
    resetError,
    setLoadingState,
    updateData,
  };
};

// Hook para crear una función
const useCreateFunction = (
  agentId: number,
  state: ReturnType<typeof useFunctionState>
) => {
  const { handleOperation } = useSweetAlert();
  const { setLoadingState, resetError, updateData } = state;

  return useCallback(
    async (functionData: FunctionData<HttpRequestFunction>) => {
      try {
        setLoadingState(true);
        resetError();

        const dataToSend = {
          ...functionData,
          agentId,
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
          updateData(result.data);
          return result.data;
        }
        return null;
      } finally {
        setLoadingState(false);
      }
    },
    [agentId, handleOperation, setLoadingState, resetError, updateData]
  );
};

// Hook para actualizar una función
const useUpdateFunction = (
  functionId: number | undefined,
  state: ReturnType<typeof useFunctionState>
) => {
  const { handleOperation } = useSweetAlert();
  const { setLoadingState, resetError, updateData } = state;

  return useCallback(
    async (functionData: Partial<FunctionData<HttpRequestFunction>>) => {
      if (!functionId) return;

      try {
        setLoadingState(true);
        resetError();

        const result = await handleOperation(
          () => functionsService.update(functionId, functionData),
          {
            title: "Actualizando función",
            successTitle: "¡Función actualizada!",
            successText: "La función se ha actualizado exitosamente",
            errorTitle: "Error al actualizar la función",
          }
        );

        if (result.success && result.data) {
          updateData(result.data);
          return result.data;
        }
        return null;
      } finally {
        setLoadingState(false);
      }
    },
    [functionId, handleOperation, setLoadingState, resetError, updateData]
  );
};

// Hook para eliminar una función
const useDeleteFunction = (
  functionId: number | undefined,
  state: ReturnType<typeof useFunctionState>
) => {
  const { handleOperation, showConfirmation } = useSweetAlert();
  const { setLoadingState, resetError } = state;

  return useCallback(async () => {
    if (!functionId) return false;

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

      setLoadingState(true);
      resetError();

      const result = await handleOperation(
        () => functionsService.delete(functionId),
        {
          title: "Eliminando función",
          successTitle: "¡Función eliminada!",
          successText: "La función se ha eliminado exitosamente",
          errorTitle: "Error al eliminar la función",
        }
      );

      return result.success;
    } finally {
      setLoadingState(false);
    }
  }, [
    functionId,
    handleOperation,
    showConfirmation,
    setLoadingState,
    resetError,
  ]);
};

// Hook principal que combina todos los subhooks
export const useFunctionActions = (
  initialData: FunctionData<HttpRequestFunction>
) => {
  const state = useFunctionState(initialData);
  const createFunction = useCreateFunction(initialData.agentId, state);
  const updateFunction = useUpdateFunction(state.data.functionId, state);
  const deleteFunction = useDeleteFunction(state.data.functionId, state);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    createFunction,
    updateFunction,
    deleteFunction,
  };
};
