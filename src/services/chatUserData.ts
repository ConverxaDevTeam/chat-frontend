import { axiosInstance } from "@store/actions/auth";

export interface ChatUserStandardFields {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  web?: string;
  browser?: string;
  operating_system?: string;
  ip?: string;
}

export interface ChatUserCustomFields {
  [key: string]: string | number | boolean;
}

export interface ChatUserBulkUpdateRequest {
  standardFields?: ChatUserStandardFields;
  customFields?: ChatUserCustomFields;
}

export interface ChatUserDataResponse {
  ok: boolean;
  data: {
    standardInfo: {
      id: number;
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      avatar?: string;
      web?: string;
      browser?: string;
      operating_system?: string;
      ip?: string;
      identified?: string;
      type?: string;
      last_login?: string;
      secret?: string;
      created_at?: string;
      updated_at?: string;
    };
    customData: ChatUserCustomFields;
  };
}

export interface ChatUserBulkUpdateResponse {
  ok: boolean;
  message: string;
  data: {
    standardFields: {
      updated: string[];
      errors: Array<{
        field: string;
        error: string;
      }>;
    };
    customFields: {
      updated: string[];
      errors: Array<{
        field: string;
        error: string;
      }>;
    };
    updatedUser: unknown;
  };
}

// Obtener datos completos del chat user
export const getChatUserData = async (
  userId: number
): Promise<ChatUserDataResponse | null> => {
  try {
    const response = await axiosInstance.get<ChatUserDataResponse>(
      `/api/chat-user/${userId}/info`
    );

    if (response.data.ok) {
      return response.data;
    } else {
      console.error("Error al obtener datos del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
};

// Actualizar múltiples campos del chat user
export const bulkUpdateChatUser = async (
  userId: number,
  updateData: ChatUserBulkUpdateRequest
): Promise<ChatUserBulkUpdateResponse | null> => {
  try {
    const response = await axiosInstance.put<ChatUserBulkUpdateResponse>(
      `/api/chat-user/${userId}/bulk-update`,
      updateData
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    return null;
  }
};
