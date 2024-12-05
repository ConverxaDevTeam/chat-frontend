import { useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FunctionParam } from "@interfaces/function-params.interface";
import { paramsService } from "@services/params.service";

interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

export const useParamsActions = (functionId: number) => {
  const [isLoading, setIsLoading] = useState(false);

  const createParam = async (param: FunctionParam) => {
    try {
      setIsLoading(true);
      await paramsService.create(param, functionId);
      toast.success("Parámetro creado exitosamente");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || "Error al crear el parámetro"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateParam = async ({
    paramId,
    data,
  }: {
    paramId: string;
    data: Partial<FunctionParam>;
  }) => {
    try {
      setIsLoading(true);
      await paramsService.update(functionId, paramId, data);
      toast.success("Parámetro actualizado exitosamente");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || "Error al actualizar el parámetro"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteParam = async (paramId: string) => {
    try {
      setIsLoading(true);
      await paramsService.delete(functionId, paramId);
      toast.success("Parámetro eliminado exitosamente");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || "Error al eliminar el parámetro"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createParam,
    updateParam,
    deleteParam,
  };
};
