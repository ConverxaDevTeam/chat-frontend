import { FunctionParam } from "@interfaces/function-params.interface";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { functionsService } from "@services/functions.service";
import { useState, useEffect, useCallback } from "react";

interface FunctionDataState {
  isLoading: boolean;
  data: FunctionData<HttpRequestFunction> | null;
}

// Hook para manejar el estado de la carga
const useLoadingState = () => {
  const [state, setState] = useState<FunctionDataState>({
    isLoading: false,
    data: null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setData = useCallback(
    (data: FunctionData<HttpRequestFunction> | null) => {
      setState(prev => ({ ...prev, data }));
    },
    []
  );

  return {
    state,
    setLoading,
    setData,
  };
};

export const useFunctionData = (
  functionId: number | undefined,
  selected: boolean,
  setParams: (params: FunctionParam[]) => void
) => {
  const { state, setLoading, setData } = useLoadingState();

  const fetchFunction = useCallback(async () => {
    if (!functionId) return;

    setLoading(true);
    try {
      const fetchedFunction = await functionsService.getById(functionId);
      setData(fetchedFunction);
      setParams(fetchedFunction.config.requestBody || []);
    } catch (error) {
      console.error("Error fetching function:", error);
      throw new Error("Error al cargar la función");
    } finally {
      setLoading(false);
    }
  }, [functionId, setLoading, setData]);

  useEffect(() => {
    if (!selected || !functionId) return;
    fetchFunction();
  }, [selected, functionId, fetchFunction]);

  return {
    ...state,
    refetch: fetchFunction,
  };
};
