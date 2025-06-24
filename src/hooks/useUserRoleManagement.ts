import { useState } from "react";
import { toast } from "react-toastify";
import { OrganizationRoleType } from "@utils/interfaces";
import { changeUserRole } from "@services/user";

interface IUserApi {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  email_verified: boolean;
  last_login: string | null;
  userOrganizations: {
    id?: number;
    role: OrganizationRoleType;
    organization: {
      id?: number;
      name?: string;
    } | null;
  }[];
}

interface UseUserRoleManagementProps {
  userRole: OrganizationRoleType;
  organizationId: number | null;
  onSuccess: () => void;
}

export const useUserRoleManagement = ({
  userRole,
  organizationId,
  onSuccess,
}: UseUserRoleManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserApi | null>(null);

  const validateUserRoleChange = (user: IUserApi): boolean => {
    if (userRole !== OrganizationRoleType.OWNER) {
      toast.error("No tienes permisos para realizar esta acción", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    const targetUserRole = user.userOrganizations[0]?.role;
    if (
      targetUserRole !== OrganizationRoleType.USER &&
      targetUserRole !== OrganizationRoleType.HITL
    ) {
      toast.error(
        "Solo se puede cambiar entre roles de Usuario y Agente Humano",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return false;
    }

    return true;
  };

  const handleInitiateRoleChange = (user: IUserApi) => {
    if (!validateUserRoleChange(user)) {
      return;
    }

    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmRoleChange = async (newRole: OrganizationRoleType) => {
    if (!selectedUser || !organizationId) {
      toast.error("Error en la selección de usuario u organización", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await changeUserRole(
        organizationId,
        selectedUser.id,
        newRole
      );

      if (result.success) {
        toast.success(result.message || "Rol actualizado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        onSuccess();
        setIsModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error("Error al cambiar el rol del usuario", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return {
    isModalOpen,
    selectedUser,
    handleInitiateRoleChange,
    handleConfirmRoleChange,
    handleCloseModal,
  };
};
