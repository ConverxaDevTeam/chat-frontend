import { apiUrls } from "@config/config";
import {
  ConversationDetailResponse,
  ConversationFilters,
  ConversationListResponse,
  ConversationListItem,
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

    const response = await axiosInstance.get<ConversationDetailResponse>(url);

    // Verificar si response.data existe y es un objeto válido
    if (!response.data || typeof response.data !== "object") {
      alertError("Respuesta inválida del servidor");
      return null;
    }

    // Verificar si la respuesta está envuelta en otra estructura
    let conversationData = response.data;

    // Verificar estructuras comunes de respuesta del backend
    const dynamicData = response.data as unknown as DynamicResponse;
    if (dynamicData.data && typeof dynamicData.data === "object") {
      conversationData = dynamicData.data;
    } else if (
      dynamicData.conversation &&
      typeof dynamicData.conversation === "object"
    ) {
      conversationData = dynamicData.conversation;
    }

    // Verificar si conversationData es válido
    if (!conversationData || typeof conversationData !== "object") {
      alertError("Datos de conversación inválidos");
      return null;
    }

    if (response.status === 200) {
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
        messages = [];
      }

      const result = {
        ...conversationData,
        messages: messages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      } as ConversationDetailResponse;
      return result;
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

export const getConversationHistory = async (
  organizationId: number,
  secret: string
): Promise<ConversationHistoryResponse> => {
  try {
    const url = `${apiUrls.getConversationsByOrganizationId(organizationId)}?secret=${secret}`;

    const response = await axiosInstance.get<ConversationHistoryResponse>(url);

    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && typeof response.data === "object") {
      // Verificar si está envuelta en otra estructura
      if (response.data.ok !== undefined) {
        if (response.data.ok) {
          if (
            response.data.conversations &&
            Array.isArray(response.data.conversations)
          ) {
            return response.data;
          } else {
            return {
              ok: false,
              conversations: [],
            };
          }
        } else {
          alertError("Error al cargar el historial de conversaciones");
          return {
            ok: false,
            conversations: [],
          };
        }
      } else {
        // Tal vez la respuesta es directamente el array o está en otra estructura
        if (Array.isArray(response.data)) {
          return {
            ok: true,
            conversations: response.data,
          };
        } else if (
          response.data.conversations &&
          Array.isArray(response.data.conversations)
        ) {
          return {
            ok: true,
            conversations: response.data.conversations,
          };
        } else {
          alertError("Formato de respuesta inesperado");
          return {
            ok: false,
            conversations: [],
          };
        }
      }
    } else {
      alertError("Respuesta inválida del servidor");
      return {
        ok: false,
        conversations: [],
      };
    }
  } catch (error) {
    let message = "Error inesperado al cargar el historial";
    if (axios.isAxiosError(error)) {
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

// Función para obtener TODAS las conversaciones con filtros aplicados (para export)
export const getAllConversationsForExport = async (
  organizationId: number,
  filters?: ConversationFilters
): Promise<ConversationListItem[]> => {
  try {
    // Primero intentamos obtener todas con el límite máximo permitido
    const filtersWithHighLimit = {
      ...filters,
      limit: 100, // Límite máximo permitido por el backend
      page: 1,
    };

    const response = await getConversationsByOrganizationId(
      organizationId,
      filtersWithHighLimit
    );

    if (response.ok) {
      // Si obtenemos todas las conversaciones en una sola llamada
      if (response.conversations.length === response.pagination?.totalItems) {
        return response.conversations;
      }

      // Si hay más conversaciones, hacemos múltiples llamadas
      const totalPages = response.pagination?.totalPages || 1;
      const allConversations: ConversationListItem[] = [
        ...response.conversations,
      ];

      // Hacer llamadas para las páginas restantes con límite de 100
      for (let page = 2; page <= totalPages; page++) {
        const pageFilters = {
          ...filters,
          page,
          limit: 100, // Usar el límite máximo permitido
        };

        const pageResponse = await getConversationsByOrganizationId(
          organizationId,
          pageFilters
        );

        if (pageResponse.ok) {
          allConversations.push(...pageResponse.conversations);
        }
      }

      return allConversations;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener todas las conversaciones:", error);
    return [];
  }
};
