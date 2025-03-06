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
      return {
        ...response.data,
        messages: response.data.messages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      };
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
      apiUrls.assignConversationToHitl(conversationId)
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
      apiUrls.reassignConversationToHitl(conversationId)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("Error inesperado");
  }
};

export const sendMessage = async (formData: FormData): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(apiUrls.sendMessage(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
    const sortedConversation = {
      ...conversation,
      messages: conversation.messages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    };
    switch (format) {
      case "csv":
        exportToCSV(sortedConversation);
        break;
      case "excel":
        exportToExcel(sortedConversation);
        break;
      case "pdf":
        exportToPDF(sortedConversation);
        break;
    }
    return true;
  } catch (error) {
    alertError("Error al exportar la conversación");
    return false;
  }
};

export const deleteConversation = async (conversationId: number) => {
  try {
    await axiosInstance.delete(apiUrls.deleteConversation(conversationId));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("Error inesperado");
  }
};
