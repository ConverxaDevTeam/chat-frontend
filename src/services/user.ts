import { apiUrls } from "@config/config";
import { UserResponse } from "@interfaces/user";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import { OrganizationRoleType } from "@utils/interfaces";
import axios from "axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: OrganizationRoleType;
}

const handleAxiosError = (error: unknown): string => {
  let message = "Error inesperado";
  if (axios.isAxiosError(error)) {
    if (error.response) {
      message = error.response.data?.message || "Error inesperado del servidor";
    } else if (error.request) {
      message = "No se pudo conectar con el servidor";
    } else {
      message = error.message;
    }
  }
  alertError(message);
  return message;
};

export const getUserMyOrganization = async (organizationId: number) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getUserMyOrganization(organizationId)
    );
    if (response.data.ok) {
      return response.data.users.map((user: User) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        userOrganizations: [
          {
            role: user.role,
            organization: null,
          },
        ],
      }));
    } else {
      alertError(response.data.message);
      return [];
    }
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const getOrganizationUsers = async (organizationId: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/user/organization/${organizationId}/users`
    );
    if (response.data.ok) {
      return response.data.users.map(
        (user: { id: number; email: string; name: string; role: string }) => ({
          id: user.id,
          email: user.email,
          first_name: user.name.split(" ")[0] || "",
          last_name: user.name.split(" ").slice(1).join(" ") || "",
          userOrganizations: [
            {
              role: user.role as OrganizationRoleType,
              organization: null,
            },
          ],
        })
      );
    } else {
      alertError(response.data.message);
      return [];
    }
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const addUserInOrganizationById = async (
  organizationId: number,
  data: {
    email: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.addUserInOrganizationById(organizationId),
      data
    );
    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const getGlobalUsers = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getGlobalUsers());
    if (response.data.ok) {
      const usersWithDetails = await Promise.all(
        response.data.users.map(async (user: { id: number }) => {
          try {
            const detailedUser = await getGlobalUser(user.id);
            return detailedUser || user;
          } catch (error) {
            return user;
          }
        })
      );

      return usersWithDetails;
    } else {
      alertError(response.data.message);
      return [];
    }
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const createGlobalUser = async (
  email: string,
  role: OrganizationRoleType,
  organizationId?: number
) => {
  const global_roles = [
    OrganizationRoleType.ADMIN,
    OrganizationRoleType.ING_PREVENTA,
    OrganizationRoleType.USR_TECNICO,
  ];
  if (!global_roles.includes(role)) {
    alertError("Rol no permitido");
    return false;
  }
  try {
    const response = await axiosInstance.post(apiUrls.getUser(), {
      email,
      role,
      organizationId,
    });
    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteGlobalUser = async (userId: number) => {
  try {
    const response = await axiosInstance.delete(
      apiUrls.getGlobalUsers() + "/" + userId
    );
    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const getGlobalUser = async (userId: number) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrls.getGlobalUsers()}/${userId}`
    );
    if (response.data.ok) {
      return response.data.user as UserResponse;
    } else {
      alertError(response.data.message);
      return null;
    }
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};

export const updateGlobalUser = async (userId: number, email: string) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrls.getGlobalUsers()}/${userId}`,
      {
        email,
      }
    );

    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteRole = async (roleId: number) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteRole(roleId));
    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const changeUserPassword = async (
  userId: number,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.post(
      `/api/user/change-password/${userId}`,
      { newPassword }
    );
    if (response.data.ok) {
      return true;
    } else {
      alertError(response.data.message || "Error al cambiar la contraseña");
      return false;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteUserFromOrganization = async (
  organizationId: number,
  userId: number
) => {
  try {
    const response = await axiosInstance.delete(
      apiUrls.deleteUserFromOrganization(organizationId, userId)
    );
    if (response.data.ok) {
      return {
        success: true,
        userDeleted: response.data.userDeleted,
        roleDeleted: response.data.roleDeleted,
        message: response.data.message,
      };
    } else {
      alertError(response.data.message || "Error al eliminar usuario");
      return { success: false };
    }
  } catch (error) {
    handleAxiosError(error);
    return { success: false };
  }
};

export const changeUserRole = async (
  organizationId: number,
  userId: number,
  newRole: OrganizationRoleType
) => {
  try {
    const response = await axiosInstance.patch(
      apiUrls.changeUserRole(organizationId, userId),
      { role: newRole }
    );
    if (response.data.ok) {
      return {
        success: true,
        message: response.data.message || "Rol actualizado correctamente",
      };
    } else {
      alertError(response.data.message || "Error al cambiar el rol");
      return { success: false };
    }
  } catch (error) {
    handleAxiosError(error);
    return { success: false };
  }
};
