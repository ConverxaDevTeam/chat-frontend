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
      return response.data.users;
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
