import { apiUrls } from "@config/config";
import {
  ConversationDetailResponse,
  ConversationFilters,
  ConversationListResponse,
  ChatUserFilters,
  ChatUserListResponse,
} from "@interfaces/conversation";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import axios from "axios";
import { exportToCSV, exportToExcel, exportToPDF } from "./export.service";

interface ConversationHistory {
  id: number;
  created_at: string;
  messages: Array<{
    id: number;
    text: string;
    created_at: string;
    is_from_user: boolean;
  }>;
}

interface ConversationHistoryResponse {
  ok: boolean;
  conversations: ConversationHistory[];
}

interface DynamicResponse {
  [key: string]: unknown;
  data?: ConversationDetailResponse;
  conversation?: ConversationDetailResponse;
}

const buildQueryParams = (filters: ConversationFilters): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

const buildChatUserQueryParams = (filters: ChatUserFilters): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

export const getChatUsersByOrganizationId = async (
  organizationId: number,
  filters?: ChatUserFilters
): Promise<ChatUserListResponse> => {
  try {
    let url = apiUrls.getChatUsersByOrganizationId(organizationId);

    if (filters) {
      const queryParams = buildChatUserQueryParams(filters);
      if (queryParams) {
        url += `?${queryParams}`;
      }
    }

    const response = await axiosInstance.get<ChatUserListResponse>(url);

    if (response.data.ok) {
      return response.data;
    } else {
      alertError(response.data.message || "Error al obtener chat users");
      return {
        ok: false,
        chat_users: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
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
    return {
      ok: false,
      chat_users: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
};

export const getConversationsByOrganizationId = async (
  organizationId: number,
  filters?: ConversationFilters
): Promise<ConversationListResponse> => {
  try {
    let url = apiUrls.getConversationsByOrganizationId(organizationId);

    if (filters) {
      const queryParams = buildQueryParams(filters);
      if (queryParams) {
        url += `?${queryParams}`;
      }
    }

    const response = await axiosInstance.get<ConversationListResponse>(url);

    if (response.data.ok) {
      return response.data;
    } else {
      alertError(response.data.message || "Error al obtener conversaciones");
      return {
        ok: false,
        conversations: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
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
    return {
      ok: false,
      conversations: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
};

export const getConversationByOrganizationIdAndById = async (
  organizationId: number,
  conversationId: number
) => {
  try {
    const url = apiUrls.getConversationByOrganizationIdAndById(
      organizationId,
      conversationId
    );
    console.log("Service: Fetching conversation from:", url);
    console.log("Service: Parameters:", { organizationId, conversationId });
    console.log("Service: Timestamp:", Date.now());

    const response = await axiosInstance.get<ConversationDetailResponse>(url);
    console.log("Service: Response status:", response.status);
    console.log("Service: Response data:", response.data);
    console.log("Service: Response data type:", typeof response.data);
    console.log(
      "🔍 DEBUG: Para debuggear ejecuta en consola: debugConversationResponse(" +
        organizationId +
        ", " +
        conversationId +
        ")"
    );

    // Verificar si response.data existe y es un objeto válido
    if (!response.data || typeof response.data !== "object") {
      console.error("Service: Invalid response data:", response.data);
      alertError("Respuesta inválida del servidor");
      return null;
    }

    // Verificar si la respuesta está envuelta en otra estructura
    let conversationData = response.data;

    // Verificar estructuras comunes de respuesta del backend
    const dynamicData = response.data as unknown as DynamicResponse;
    if (dynamicData.data && typeof dynamicData.data === "object") {
      console.log("Service: Found wrapped data structure");
      conversationData = dynamicData.data;
    } else if (
      dynamicData.conversation &&
      typeof dynamicData.conversation === "object"
    ) {
      console.log("Service: Found wrapped conversation structure");
      conversationData = dynamicData.conversation;
    }

    console.log("Service: Final conversation data:", conversationData);
    console.log("Service: Conversation data type:", typeof conversationData);
    console.log(
      "Service: Conversation data keys:",
      Object.keys(conversationData || {})
    );

    // Verificar si conversationData es válido
    if (!conversationData || typeof conversationData !== "object") {
      console.error("Service: Invalid conversation data:", conversationData);
      alertError("Datos de conversación inválidos");
      return null;
    }

    console.log("Service: Response data structure:", {
      hasMessages: "messages" in conversationData,
      messagesType: typeof conversationData.messages,
      messagesValue: conversationData.messages,
      dataKeys: Object.keys(conversationData),
    });

    if (response.status === 200) {
      console.log(
        "Service: Messages count:",
        conversationData.messages?.length || 0
      );
      console.log("Service: About to return conversation data");

      // Verificación robusta para messages
      let messages: ConversationDetailResponse["messages"] = [];
      const dynamicConversation =
        conversationData as unknown as DynamicResponse;
      if (
        conversationData &&
        dynamicConversation.messages &&
        Array.isArray(dynamicConversation.messages)
      ) {
        messages =
          dynamicConversation.messages as ConversationDetailResponse["messages"];
      } else {
        console.warn(
          "Service: Messages not found or not an array, using empty array"
        );
        messages = [];
      }
      console.log("Service: Messages array:", messages);

      const result = {
        ...conversationData,
        messages: messages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      } as ConversationDetailResponse;
      console.log("Service: Returning result:", result);
      return result;
    } else {
      console.error("Service: Non-200 status:", response.status, response.data);
      alertError(String(response.data));
      console.log("Service: Returning null due to non-200 status");
      return null;
    }
  } catch (error) {
    console.error("Service: Error fetching conversation:", error);
    let message = "Error inesperado";
    if (axios.isAxiosError(error)) {
      console.error("Service: Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
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
    console.log("Service: Returning null due to error");
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

export const getConversationHistory = async (
  organizationId: number,
  secret: string
): Promise<ConversationHistoryResponse> => {
  try {
    const url = `${apiUrls.getConversationsByOrganizationId(organizationId)}?secret=${secret}`;
    console.log("Service: Fetching conversation history from:", url);
    console.log("Service: Parameters:", { organizationId, secret });

    const response = await axiosInstance.get<ConversationHistoryResponse>(url);
    console.log("Service: Full response:", response);
    console.log("Service: Response status:", response.status);
    console.log("Service: Response data:", response.data);

    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && typeof response.data === "object") {
      console.log("Service: Response data keys:", Object.keys(response.data));

      // Verificar si está envuelta en otra estructura
      if (response.data.ok !== undefined) {
        console.log("Service: Found 'ok' property:", response.data.ok);
        if (response.data.ok) {
          console.log(
            "Service: Conversations array:",
            response.data.conversations
          );
          if (
            response.data.conversations &&
            Array.isArray(response.data.conversations)
          ) {
            console.log(
              "Service: Number of conversations:",
              response.data.conversations.length
            );
            response.data.conversations.forEach((conv, index) => {
              console.log(`Service: Conversation ${index}:`, {
                id: conv.id,
                created_at: conv.created_at,
                messagesCount: conv.messages?.length || 0,
                firstMessage: conv.messages?.[0],
              });
            });
          }
          return response.data;
        } else {
          console.error("Service: API returned ok: false");
          alertError("Error al cargar el historial de conversaciones");
          return {
            ok: false,
            conversations: [],
          };
        }
      } else {
        // Tal vez la respuesta es directamente el array o está en otra estructura
        console.log(
          "Service: No 'ok' property found, checking for direct array or other structures"
        );
        if (Array.isArray(response.data)) {
          console.log("Service: Response is direct array, wrapping it");
          return {
            ok: true,
            conversations: response.data,
          };
        } else if (
          response.data.conversations &&
          Array.isArray(response.data.conversations)
        ) {
          console.log("Service: Found conversations array without ok property");
          return {
            ok: true,
            conversations: response.data.conversations,
          };
        } else {
          console.error(
            "Service: Unexpected response structure:",
            response.data
          );
          alertError("Formato de respuesta inesperado");
          return {
            ok: false,
            conversations: [],
          };
        }
      }
    } else {
      console.error("Service: Invalid response data:", response.data);
      alertError("Respuesta inválida del servidor");
      return {
        ok: false,
        conversations: [],
      };
    }
  } catch (error) {
    console.error("Service: Error in getConversationHistory:", error);
    let message = "Error inesperado al cargar el historial";
    if (axios.isAxiosError(error)) {
      console.error("Service: Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    alertError(message);
    return {
      ok: false,
      conversations: [],
    };
  }
};
