import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import axios from "axios";

export const getIntegrationWebChat = async (
  departmentId: number,
  selectOrganizationId: number
) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getIntegrationWebChat(departmentId, selectOrganizationId)
    );
    if (response.data.ok) {
      return response.data.integration;
    } else {
      alertError(response.data.message);
      return null;
    }
  } catch (error) {
    let message = "Error inesperado";
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
    alertError(message);
    return null;
  }
};
