import { useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CreateFunctionParamDto } from "@interfaces/function-params.interface";
import { paramsService } from "@services/params.service";
import { useAlertContext } from "../components/AlertContext";

interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

// Hook para manejar la lógica común de las operaciones
const useParamOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleOperation } = useAlertContext();

  const executeOperation = async <T>(
    operation: () => Promise<T>,
    {
      successMessage,
      errorMessage,
      loadingTitle,
      successTitle,
      successText,
      errorTitle,
    }: {
      successMessage: string;
      errorMessage: string;
      loadingTitle: string;
      successTitle: string;
      successText: string;
      errorTitle: string;
    }
  ) => {
    try {
      setIsLoading(true);
      const result = await handleOperation(operation, {
        title: loadingTitle,
        successTitle,
        successText,
        errorTitle,
      });

      if (result.success) {
        toast.success(successMessage);
        return { success: true as const, data: result.data as T };
      }
      return { success: false as const, error: result.error };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || errorMessage;
      toast.error(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    executeOperation,
  };
};

// Hook principal para las acciones de parámetros
export const useParamsActions = (functionId: number) => {
  const { isLoading, executeOperation } = useParamOperation();

  const createParam = async (param: CreateFunctionParamDto) => {
    const result = await executeOperation(
      () => paramsService.create(param, functionId),
      {
        successMessage: "Parámetro creado exitosamente",
        errorMessage: "Error al crear el parámetro",
        loadingTitle: "Creando parámetro",
        successTitle: "Parámetro creado",
        successText: "El parámetro se ha creado exitosamente",
        errorTitle: "Error al crear el parámetro",
      }
    );

    return result.success;
  };

  const updateParam = async ({
    paramId,
    data,
  }: {
    paramId: string;
    data: CreateFunctionParamDto;
  }) => {
    const result = await executeOperation(
      () => paramsService.update(functionId, paramId, data),
      {
        successMessage: "Parámetro actualizado exitosamente",
        errorMessage: "Error al actualizar el parámetro",
        loadingTitle: "Actualizando parámetro",
        successTitle: "Parámetro actualizado",
        successText: "El parámetro se ha actualizado exitosamente",
        errorTitle: "Error al actualizar el parámetro",
      }
    );

    return result.success;
  };

  const deleteParam = async (paramId: string) => {
    const result = await executeOperation(
      () => paramsService.delete(functionId, paramId),
      {
        successMessage: "Parámetro eliminado exitosamente",
        errorMessage: "Error al eliminar el parámetro",
        loadingTitle: "Eliminando parámetro",
        successTitle: "Parámetro eliminado",
        successText: "El parámetro se ha eliminado exitosamente",
        errorTitle: "Error al eliminar el parámetro",
      }
    );

    return result.success;
  };

  return {
    isLoading,
    createParam,
    updateParam,
    deleteParam,
  };
};
