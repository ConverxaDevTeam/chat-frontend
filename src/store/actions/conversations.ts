import { createAction } from "@reduxjs/toolkit";
import { IConversation, IMessage } from "@utils/interfaces";
import { alertError } from "@utils/alerts";
import axios from "axios";
import { apiUrls } from "@config/config";
import {
  ConversationListItem,
  ConversationListResponse,
} from "@interfaces/conversation";
import { axiosInstance } from "./auth";

export const newMessageChat = createAction(
  "conversations/newMessageChat",
  (payload: { message: IMessage; conversationId: number }) => {
    return { payload };
  }
);

export const uploadConversation = createAction(
  "conversations/uploadConversation",
  (payload: IConversation) => {
    return { payload };
  }
);

export const getConversationsByOrganizationId = async (
  organizationId: number
): Promise<ConversationListItem[]> => {
  try {
    const response = await axiosInstance.get<ConversationListResponse>(
      apiUrls.getConversationsByOrganizationId(organizationId)
    );
    if (response.data.ok) {
      return response.data.conversations;
    } else {
      alertError(response.data.message || "Error al obtener conversaciones");
      return [];
    }
  } catch (error) {
    let message = "Error inesperado";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    alertError(message);
    return [];
  }
};
