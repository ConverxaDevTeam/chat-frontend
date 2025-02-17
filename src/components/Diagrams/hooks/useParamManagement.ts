import { useState } from "react";
import {
  FunctionParam,
  CreateFunctionParamDto,
} from "@interfaces/function-params.interface";
import { paramsService } from "@services/params.service";
import { useAlertContext } from "../components/AlertContext";
import { toast } from "react-toastify";

interface UseParamManagementProps {
  functionId: number;
  params: FunctionParam[];
  setParams: (params: FunctionParam[]) => void;
}

export const useParamManagement = ({
  functionId,
  params,
  setParams,
}: UseParamManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showConfirmation, handleOperation } = useAlertContext();

  const createParam = async (param: CreateFunctionParamDto) => {
    try {
      setIsLoading(true);
      const newParam = await paramsService.create(param, functionId);
      setParams([...params, newParam]);
      toast.success("Parámetro creado exitosamente");
      return true;
    } catch (error) {
      toast.error("Error al crear el parámetro");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateParam = async (index: number, param: CreateFunctionParamDto) => {
    try {
      setIsLoading(true);
      const updatedParam = await paramsService.update(
        functionId,
        index.toString(),
        param
      );
      const newParams = [...params];
      newParams[index] = updatedParam;
      setParams(newParams);
      toast.success("Parámetro actualizado exitosamente");
      return true;
    } catch (error) {
      toast.error("Error al actualizar el parámetro");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteParam = async (index: number) => {
    const confirmed = await showConfirmation({
      title: "¿Eliminar parámetro?",
      text: "¿Estás seguro de que deseas eliminar este parámetro? Esta acción no se puede deshacer.",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmed) {
      const result = await handleOperation(
        () => paramsService.delete(functionId, index.toString()),
        {
          title: "Eliminando parámetro",
          successTitle: "Parámetro eliminado",
          successText: "El parámetro se ha eliminado exitosamente",
          errorTitle: "Error al eliminar el parámetro",
        }
      );

      if (result.success) {
        const newParams = [...params];
        newParams.splice(index, 1);
        setParams(newParams);
        return true;
      }
    }
    return false;
  };

  return {
    isLoading,
    createParam,
    updateParam,
    deleteParam,
  };
};
