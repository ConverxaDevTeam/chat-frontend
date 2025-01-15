import { apiUrls } from "@config/config";
import { ConversationDetailResponse } from "@interfaces/conversation";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import axios from "axios";
import { exportToCSV, exportToExcel, exportToPDF } from "./export.service";

export const getConversationsByOrganizationId = async (
  organizationId: number
) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getConversationsByOrganizationId(organizationId)
    );
    if (response.data.ok) {
      return response.data.conversations;
    } else {
      alertError(response.data.message);
      return [];
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

export const getConversationByOrganizationIdAndById = async (
  organizationId: number,
  conversationId: number
) => {
  try {
    const response = await axiosInstance.get<ConversationDetailResponse>(
      apiUrls.getConversationByOrganizationIdAndById(
        organizationId,
        conversationId
      )
    );
    if (response.status === 200) {
      return response.data;
    } else {
      alertError(String(response.data));
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

export const assignConversationToHitl = async (conversationId: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/conversation/${conversationId}/assign-hitl`
    );
    if (response.data.ok) {
      return response.data.conversation;
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("Error inesperado");
  }
};

export const reassignConversationToHitl = async (conversationId: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/conversation/${conversationId}/reassign-hitl`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("Error inesperado");
  }
};

export const sendMessage = async (
  conversationId: number,
  message: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      `/api/integration-router/send-message`,
      {
        message,
        conversationId,
      }
    );

    if (response.data.ok) {
      return true;
    } else {
      alertError(response.data.message);
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
    return false;
  }
};

export const exportConversation = (
  _organizationId: number,
  _conversationId: number,
  format: "csv" | "pdf" | "excel",
  conversation: ConversationDetailResponse
): boolean => {
  try {
    switch (format) {
      case "csv":
        exportToCSV(conversation);
        break;
      case "excel":
        exportToExcel(conversation);
        break;
      case "pdf":
        exportToPDF(conversation);
        break;
    }
    return true;
  } catch (error) {
    alertError("Error al exportar la conversación");
    return false;
  }
};
