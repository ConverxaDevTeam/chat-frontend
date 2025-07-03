export enum ChatUserType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
  SLACK = "slack",
}

export interface IChatUserStandardInfo {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  type?: ChatUserType;
  created_at?: string;
  last_login?: string;
}

export interface IChatUserCustomData {
  [key: string]: string | number | boolean;
}

export interface ILastConversation {
  conversation_id: number;
  last_message_text: string;
  last_message_created_at: string;
  last_message_type: string;
  unread_messages: number;
  need_human: boolean;
  assigned_user_id: number | null;
  integration_type: string;
  department: string;
  last_activity: string;
  status: "ia" | "pendiente" | "asignado";
}

export interface IChatUser {
  standardInfo?: IChatUserStandardInfo;
  customData?: IChatUserCustomData;
  lastConversation?: ILastConversation;
}

export interface IChatUsersResponse {
  ok: boolean;
  users: IChatUser[];
  total: number;
  page: number;
  totalPages: number;
  totalItems?: number;
}

export type SortBy =
  | "name"
  | "email"
  | "phone"
  | "last_login"
  | "created_at"
  | "last_activity";
export type SortOrder = "ASC" | "DESC";

export interface IChatUsersFilters {
  page?: number;
  limit?: number;
  organizationId?: number;
  search?: string;
  type?: ChatUserType;
  needHuman?: boolean;
  hasUnreadMessages?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
