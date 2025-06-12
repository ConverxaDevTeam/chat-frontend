import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HitlUserWithRole } from "@interfaces/hitl.interface";
import {
  assignUsersToHitlType,
  removeUserFromHitlType,
} from "@services/hitl.service";
import { getUserMyOrganization } from "@services/user";
import { useSweetAlert } from "./useSweetAlert";

interface UseHitlUserAssignmentsProps {
  organizationId: number;
  hitlTypeId?: number;
}

export const useHitlUserAssignments = ({
  organizationId,
  hitlTypeId,
}: UseHitlUserAssignmentsProps) => {
  const [availableUsers, setAvailableUsers] = useState<HitlUserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const { handleOperation, showConfirmation } = useSweetAlert();

  const fetchAvailableUsers = async () => {
    setIsLoading(true);
    try {
      const users = await getUserMyOrganization(organizationId);
      // Filter only users with HITL role
      const hitlUsers = users?.filter(user => 
        user.userOrganizations?.[0]?.role === 'hitl'
      ) || [];
      
      // Transform to match HitlUserWithRole interface
      const transformedUsers: HitlUserWithRole[] = hitlUsers.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.userOrganizations[0].role
      }));
      
      setAvailableUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching HITL users:", error);
      setAvailableUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const assignUsers = async (
    userIds: number[],
    onSuccess?: () => void
  ): Promise<boolean> => {
    if (!hitlTypeId) {
      toast.error("ID de tipo HITL no válido");
      return false;
    }

    if (userIds.length === 0) {
      toast.error("Debe seleccionar al menos un usuario");
      return false;
    }

    const result = await handleOperation(
      async () => {
        setIsAssigning(true);
        const success = await assignUsersToHitlType(
          organizationId,
          hitlTypeId,
          { userIds }
        );
        if (!success) {
          throw new Error("No se pudieron asignar los usuarios");
        }
        if (onSuccess) {
          onSuccess();
        }
        return success;
      },
      {
        title: "Asignando usuarios",
        successTitle: "¡Éxito!",
        successText: `${userIds.length === 1 ? "Usuario asignado" : "Usuarios asignados"} correctamente`,
        errorTitle: "Error al asignar",
      }
    );

    setIsAssigning(false);
    return result.success;
  };

  const removeUser = async (
    userId: number,
    userName: string,
    onSuccess?: () => void
  ): Promise<boolean> => {
    if (!hitlTypeId) {
      toast.error("ID de tipo HITL no válido");
      return false;
    }

    const confirmed = await showConfirmation({
      title: "Confirmar eliminación",
      text: `¿Estás seguro de que deseas remover a ${userName} de este tipo HITL?`,
      confirmButtonText: "Sí, remover",
      cancelButtonText: "Cancelar",
    });

    if (!confirmed) return false;

    const result = await handleOperation(
      async () => {
        setIsRemoving(true);
        const success = await removeUserFromHitlType(
          organizationId,
          hitlTypeId,
          userId
        );
        if (!success) {
          throw new Error("No se pudo remover el usuario");
        }
        if (onSuccess) {
          onSuccess();
        }
        return success;
      },
      {
        title: "Removiendo usuario",
        successTitle: "¡Éxito!",
        successText: "Usuario removido correctamente",
        errorTitle: "Error al remover",
      }
    );

    setIsRemoving(false);
    return result.success;
  };

  const getUnassignedUsers = (
    assignedUserIds: number[]
  ): HitlUserWithRole[] => {
    return availableUsers.filter(user => !assignedUserIds.includes(user.id));
  };

  const getUserById = (userId: number): HitlUserWithRole | undefined => {
    return availableUsers.find(user => user.id === userId);
  };

  useEffect(() => {
    if (organizationId) {
      fetchAvailableUsers();
    }
  }, [organizationId]);

  return {
    availableUsers,
    isLoading,
    isAssigning,
    isRemoving,
    fetchAvailableUsers,
    assignUsers,
    removeUser,
    getUnassignedUsers,
    getUserById,
  };
};
