import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import axios from "axios";

export interface OrganizationLimits {
  departmentLimit?: number;
  userLimit?: number;
  conversationLimit?: number;
  // Agregar otros límites según sea necesario
}

export interface DepartmentLimitCheckResponse {
  canCreateDepartment: boolean;
  currentCount: number;
  limit: number;
  message?: string;
}

/**
 * Obtener los límites configurados para una organización
 */
export const getOrganizationLimits = async (
  organizationId: number
): Promise<OrganizationLimits | null> => {
  try {
    const response = await axiosInstance.get(
      apiUrls.organizationLimits.get(organizationId)
    );

    if (response.data) {
      // El backend devuelve directamente el objeto de límites
      return response.data;
    } else {
      // No mostrar error si simplemente no hay límites configurados
      return null;
    }
  } catch (error) {
    let message = "Error inesperado al obtener límites";
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        // 404 es normal si no hay límites configurados
        return null;
      }
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    alertError(message);
    throw new Error(message);
  }
};

/**
 * Actualizar los límites de una organización
 */
export const updateOrganizationLimits = async (
  organizationId: number,
  limits: Partial<OrganizationLimits>
): Promise<boolean> => {
  try {
    const response = await axiosInstance.patch(
      apiUrls.organizationLimits.update(organizationId),
      limits
    );

    if (response.data) {
      return true;
    } else {
      throw new Error("Error al actualizar límites");
    }
  } catch (error) {
    let message = "Error inesperado al actualizar límites";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    throw new Error(message);
  }
};

/**
 * Crear límites personalizados para una organización
 */
export const createOrganizationLimits = async (
  organizationId: number,
  limits: OrganizationLimits
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      apiUrls.organizationLimits.create(),
      {
        organizationId,
        ...limits,
      }
    );

    if (response.data) {
      return true;
    } else {
      throw new Error("Error al crear límites");
    }
  } catch (error) {
    let message = "Error inesperado al crear límites";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    throw new Error(message);
  }
};

/**
 * Verificar si una organización puede crear un nuevo departamento
 */
export const checkDepartmentLimit = async (
  organizationId: number
): Promise<DepartmentLimitCheckResponse> => {
  try {
    const response = await axiosInstance.get(
      apiUrls.organizationLimits.checkDepartmentLimit(organizationId)
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error al verificar límite de departamentos");
    }
  } catch (error) {
    let message = "Error inesperado al verificar límites";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    throw new Error(message);
  }
};

/**
 * Actualizar solo el límite de departamentos (función de conveniencia)
 */
export const updateDepartmentLimit = async (
  organizationId: number,
  departmentLimit: number
): Promise<boolean> => {
  return updateOrganizationLimits(organizationId, { departmentLimit });
};
