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

export interface IChatUser {
  standardInfo?: IChatUserStandardInfo;
  customData?: IChatUserCustomData;
}

export interface IChatUsersResponse {
  ok: boolean;
  users: IChatUser[];
  total: number;
  page: number;
  totalPages: number;
  totalItems?: number;
}

export interface IChatUsersFilters {
  page?: number;
  limit?: number;
  organizationId?: number;
  search?: string;
  type?: ChatUserType;
}
