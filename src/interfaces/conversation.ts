import { IntegrationType } from "./integrations";

export enum MessageType {
  USER = "user",
  AGENT = "agent",
  HITL = "hitl",
}

export enum ConversationStatus {
  IA = "ia",
  PENDING = "pending",
  TAKEN = "taken",
}

export interface Message {
  id: number;
  created_at: string;
  updated_at: string;
  text: string;
  type: MessageType;
}

export interface Conversation {
  id: number;
  created_at: string;
  updated_at: string;
  type: IntegrationType;
  user: {
    id: number;
  } | null;
  user_deleted: boolean;
  messages: Message[];
  need_human: boolean;
}

export interface FormInputs {
  message: string;
}

export interface ConversationListItem {
  id: number;
  created_at: string;
  user_id: number | null;
  secret: string;
  avatar: null; // TODO: add avatar
  unread_messages: number;
  message_id: number;
  message_text: string;
  message_type: MessageType;
  message_created_at: string;
  need_human: boolean;
  type: IntegrationType;
  department: string;
  // Nuevos campos opcionales del backend
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  integration_type?: IntegrationType;
}

export interface ConversationListResponse {
  ok: boolean;
  message?: string;
  conversations: ConversationListItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  appliedFilters?: ConversationFilters;
}

export interface ConversationFilters {
  search?: string;
  department?: string;
  integrationType?: IntegrationType;
  status?: "ia" | "pendiente" | "asignado";
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  sortBy?: "created_at" | "type" | "need_human" | "department";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export const getConversationStatus = (
  need_human: boolean,
  user_id: number | null
): ConversationStatus => {
  if (user_id) return ConversationStatus.TAKEN;
  if (!need_human) return ConversationStatus.IA;
  return ConversationStatus.PENDING;
};

export interface ConversationResponseMessage {
  id: number;
  created_at: string;
  text: string;
  audio: string | null;
  images: string[] | null;
  time: number;
  type: MessageType;
}

export interface ConversationDetailResponse {
  id: number;
  messages: ConversationResponseMessage[];
  chat_user: {
    secret: string;
    identifier: string;
  } | null;
}

export enum SortableFields {
  CREATED_AT = "created_at",
  TYPE = "type",
  NEED_HUMAN = "need_human",
  DEPARTMENT = "department",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
