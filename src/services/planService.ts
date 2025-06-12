import axios from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "@store/actions/auth"; // Assuming axiosInstance is exported from here
import { apiUrls } from "@config/config";
import { OrganizationType } from "@interfaces/organization.interface";

const handleServiceError = (error: unknown, defaultMessage: string): never => {
  const errorMessage =
    axios.isAxiosError(error) && error.response?.data?.message
      ? error.response.data.message
      : defaultMessage;
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

/**
 * Request a custom plan for the user's organization.
 * @param organizationId The ID of the organization for which the custom plan is requested
 */
export const requestCustomPlan = async (
  organizationId: number
): Promise<void> => {
  try {
    await axiosInstance.post(apiUrls.plan.requestCustom(), { organizationId });
    toast.success("Solicitud de plan personalizado recibida."); // Custom plan request received.
  } catch (error) {
    // Assuming 404 means Organization or user not found, and 500 for other errors.
    // The backend swagger indicates 202 for success, which axios treats as success.
    // Specific error messages can be refined based on actual backend responses.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw handleServiceError(error, "Organización o usuario no encontrado.");
    } else {
      throw handleServiceError(error, "Error al procesar la solicitud.");
    }
  }
};

/**
 * Set an organization's plan to custom (Super Admin only).
 */
export const setOrganizationPlanToCustom = async (
  organizationId: number
): Promise<{ id: number }> => {
  try {
    const response = await axiosInstance.patch<{ id: number }>(
      apiUrls.plan.setCustom(organizationId)
    );
    toast.success(
      "El plan de la organización se ha establecido como personalizado."
    ); // Organization plan set to custom.
    return response.data;
  } catch (error) {
    // 403: User does not have permission.
    // 404: Organization not found.
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw handleServiceError(
        error,
        "No tiene permisos para realizar esta acción."
      );
    } else if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw handleServiceError(error, "Organización no encontrada.");
    } else {
      throw handleServiceError(
        error,
        "Error al establecer el plan personalizado."
      );
    }
  }
};

/**
 * Update custom plan details for an organization (Super Admin only).
 */
export const updateCustomPlanDetails = async (
  organizationId: number,
  details: { conversationCount: number }
): Promise<{ id: number }> => {
  try {
    const response = await axiosInstance.patch<{ id: number }>(
      apiUrls.plan.updateDetails(organizationId),
      details
    );
    toast.success("Detalles del plan personalizado actualizados."); // Custom plan details updated.
    return response.data;
  } catch (error) {
    // 400: Organization is not on a custom plan or invalid data.
    // 403: User does not have permission.
    // 404: Organization not found.
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw handleServiceError(
        error,
        "La organización no tiene un plan personalizado o los datos son inválidos."
      );
    } else if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw handleServiceError(
        error,
        "No tiene permisos para realizar esta acción."
      );
    } else if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw handleServiceError(error, "Organización no encontrada.");
    } else {
      throw handleServiceError(
        error,
        "Error al actualizar los detalles del plan personalizado."
      );
    }
  }
};

/**
 * Change the organization type (Super Admin only).
 * @param organizationId The ID of the organization to change the type for
 * @param type The new organization type
 * @param daysToUpdate Optional, required only if type is "custom"
 */
export const changeOrganizationType = async (
  organizationId: number,
  type: OrganizationType,
  daysToUpdate?: number
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  try {
    const payload: { type: OrganizationType; daysToUpdate?: number } = { type };

    if (type === OrganizationType.CUSTOM && daysToUpdate !== undefined) {
      payload.daysToUpdate = daysToUpdate;
    }

    const response = await axiosInstance.patch(
      apiUrls.plan.changeType(organizationId),
      payload
    );

    const typeLabels = {
      [OrganizationType.PRODUCTION]: "Producción",
      [OrganizationType.MVP]: "MVP",
      [OrganizationType.FREE]: "Gratuito",
      [OrganizationType.CUSTOM]: "Personalizado",
    };

    toast.success(
      `Tipo de organización cambiado a ${typeLabels[type]} exitosamente.`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw handleServiceError(
          error,
          "Datos inválidos. Asegúrese de proporcionar los días para actualizar si el tipo es personalizado."
        );
      } else if (error.response?.status === 403) {
        throw handleServiceError(
          error,
          "No tiene permisos de superadmin para realizar esta acción."
        );
      } else if (error.response?.status === 404) {
        throw handleServiceError(error, "Organización no encontrada.");
      }
    }

    throw handleServiceError(
      error,
      "Error al cambiar el tipo de organización."
    );
  }
};
