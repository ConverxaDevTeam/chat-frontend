import { useState, useEffect } from "react";
import {
  HitlType,
  CreateHitlTypeRequest,
  UpdateHitlTypeRequest,
  HitlTypeWithStatus,
  HitlStatus,
} from "@interfaces/hitl.interface";
import {
  getHitlTypes,
  getHitlTypeById,
  createHitlType,
  updateHitlType,
  deleteHitlType,
} from "@services/hitl.service";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

interface UseHitlTypesProps {
  organizationId: number;
}

export const useHitlTypes = ({ organizationId }: UseHitlTypesProps) => {
  const [hitlTypes, setHitlTypes] = useState<HitlTypeWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleOperation, showConfirmation } = useAlertContext();

  const enhanceHitlType = (hitlType: HitlType): HitlTypeWithStatus => ({
    ...hitlType,
    status:
      hitlType.userHitlTypes.length > 0
        ? HitlStatus.ACTIVE
        : HitlStatus.INACTIVE,
    assignedUsersCount: hitlType.userHitlTypes.length,
  });

  const fetchHitlTypes = async () => {
    setIsLoading(true);
    try {
      const types = await getHitlTypes(organizationId);
      const enhancedTypes = types.map(enhanceHitlType);
      setHitlTypes(enhancedTypes);
    } catch (error) {
      console.error("Error fetching HITL types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHitlTypeDetails = async (
    hitlTypeId: number
  ): Promise<HitlType | null> => {
    try {
      const hitlType = await getHitlTypeById(organizationId, hitlTypeId);
      return hitlType;
    } catch (error) {
      console.error("Error fetching HITL type details:", error);
      return null;
    }
  };

  const createNewHitlType = async (
    data: CreateHitlTypeRequest
  ): Promise<boolean> => {
    const result = await handleOperation(
      async () => {
        setIsCreating(true);
        const newHitlType = await createHitlType(organizationId, data);
        if (!newHitlType) {
          throw new Error("No se pudo crear el tipo HITL");
        }
        await fetchHitlTypes();
        return newHitlType;
      },
      {
        title: "Creando tipo HITL",
        successTitle: "¡Éxito!",
        successText: "Tipo HITL creado correctamente",
        errorTitle: "Error al crear",
      }
    );

    setIsCreating(false);
    return result.success;
  };

  const updateExistingHitlType = async (
    hitlTypeId: number,
    data: UpdateHitlTypeRequest
  ): Promise<boolean> => {
    const result = await handleOperation(
      async () => {
        setIsUpdating(true);
        const updatedHitlType = await updateHitlType(
          organizationId,
          hitlTypeId,
          data
        );
        if (!updatedHitlType) {
          throw new Error("No se pudo actualizar el tipo HITL");
        }
        await fetchHitlTypes();
        return updatedHitlType;
      },
      {
        title: "Actualizando tipo HITL",
        successTitle: "¡Éxito!",
        successText: "Tipo HITL actualizado correctamente",
        errorTitle: "Error al actualizar",
      }
    );

    setIsUpdating(false);
    return result.success;
  };

  const deleteHitlTypeById = async (
    hitlTypeId: number,
    hitlTypeName: string
  ): Promise<boolean> => {
    const confirmed = await showConfirmation({
      title: "Confirmar eliminación",
      text: `¿Estás seguro de que deseas eliminar el tipo HITL "${hitlTypeName}"? Esta acción no se puede deshacer.`,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    console.log("CONFIRMACION ELIMINACION RESULTADO:", confirmed);
    if (!confirmed) return false;

    const result = await handleOperation(
      async () => {
        setIsDeleting(true);
        const success = await deleteHitlType(organizationId, hitlTypeId);
        if (!success) {
          throw new Error("No se pudo eliminar el tipo HITL");
        }
        await fetchHitlTypes();
        return success;
      },
      {
        title: "Eliminando tipo HITL",
        successTitle: "¡Éxito!",
        successText: "Tipo HITL eliminado correctamente",
        errorTitle: "Error al eliminar",
      }
    );

    setIsDeleting(false);
    return result.success;
  };

  useEffect(() => {
    if (organizationId) {
      fetchHitlTypes();
    }
  }, [organizationId]);

  return {
    hitlTypes,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchHitlTypes,
    getHitlTypeDetails,
    createNewHitlType,
    updateExistingHitlType,
    deleteHitlTypeById,
  };
};
