import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertConfirm, alertError } from "@utils/alerts";
import axios from "axios";

export const createIntegrationWhatsApp = async (
  departmentId: number,
  selectOrganizationId: number,
  data: {
    code: string;
    phone_number_id: string;
    waba_id: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.createIntegrationWhatsApp(departmentId, selectOrganizationId),
      data
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

export const updateIntegrationWebChat = async (
  integrationId: number,
  data: {
    cors: string[];
    title: string;
    name: string;
    sub_title: string;
    description: string;
    bg_color: string;
    text_title: string;
    bg_chat: string;
    text_color: string;
    bg_assistant: string;
    bg_user: string;
    button_color: string;
    button_text: string;
    text_date: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.updateIntegrationWebChat(integrationId),
      data
    );
    if (response.data.ok) {
      alertConfirm("Se actualizó la configuración del chat");
      return true;
    } else {
      return false;
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
    return [];
  }
};
