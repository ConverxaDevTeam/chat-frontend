import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import { OrganizationRoleType } from "@utils/interfaces";
import axios from "axios";

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
    const response = await axiosInstance.get(apiUrls.getUser());
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
