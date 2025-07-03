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
  avatar: string | null; // TODO: add avatar
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
  conversation?: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_deleted: boolean;
    type: string;
    config: Record<string, unknown>;
    need_human: boolean;
  };
  chatSession?: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: string;
    lastInteractionAt: string;
    closedAt: string | null;
    metadata: Record<string, unknown> | null;
    conversationId: number;
  };
}

export interface ConversationDetailResponse {
  id: number;
  messages: ConversationResponseMessage[];
  chat_user: {
    secret: string;
    phone: string | null;
    web: string | null;
    name: string | null;
    last_login: string | null;
    address: string | null;
    avatar: string | null;
    email: string | null;
    browser: string | null;
    operating_system: string | null;
    ip: string | null;
  } | null;
  user?: Record<string, unknown> | null;
  created_at?: string;
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

// Chat Users Interfaces
export interface ChatUserListItem {
  chat_user_id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  avatar: string | null;
  secret: string;
  identifier: string;
  last_conversation: {
    conversation_id: number;
    last_message_text: string;
    last_message_created_at: string;
    last_message_type: MessageType;
    unread_messages: number;
    need_human: boolean;
    assigned_user_id: number | null;
    integration_type: IntegrationType;
    department: string;
    last_activity: string;
    status: "ia" | "pendiente" | "asignado";
  };
}

export interface ChatUserListResponse {
  ok: boolean;
  message?: string;
  chat_users: ChatUserListItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  appliedFilters?: ChatUserFilters;
}

export interface ChatUserFilters {
  searchValue?: string;
  searchType?: "name" | "id"; // Nuevo campo para especificar tipo de búsqueda
  department?: string;
  integrationType?: IntegrationType;
  status?: "ia" | "pendiente" | "asignado";
  needHuman?: boolean;
  assignedToMe?: boolean;
  hasUnreadMessages?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?:
    | "last_activity"
    | "user_name"
    | "unread_messages"
    | "need_human"
    | "created_at";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

// Helper function to convert ChatUserListItem to ConversationListItem for backward compatibility
export const chatUserToConversationListItem = (
  chatUser: ChatUserListItem
): ConversationListItem => {
  // Use chat_user_id as unique identifier when conversation_id is 0 or missing
  const uniqueId =
    chatUser.last_conversation.conversation_id ||
    parseInt(chatUser.chat_user_id) ||
    Math.random() * 1000000;

  return {
    id: uniqueId,
    created_at: chatUser.last_conversation.last_activity,
    user_id: chatUser.last_conversation.assigned_user_id,
    secret: chatUser.secret,
    avatar: chatUser.avatar,
    unread_messages: chatUser.last_conversation.unread_messages,
    message_id: 0, // No longer relevant
    message_text: chatUser.last_conversation.last_message_text,
    message_type: chatUser.last_conversation.last_message_type,
    message_created_at: chatUser.last_conversation.last_message_created_at,
    need_human: chatUser.last_conversation.need_human,
    type: chatUser.last_conversation.integration_type,
    department: chatUser.last_conversation.department,
    user_name: chatUser.user_name || undefined,
    user_email: chatUser.user_email || undefined,
    user_phone: chatUser.user_phone || undefined,
    integration_type: chatUser.last_conversation.integration_type,
  };
};
