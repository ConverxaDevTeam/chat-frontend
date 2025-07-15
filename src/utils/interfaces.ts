import { OrganizationType } from "@interfaces/organization.interface";
import { Socket } from "socket.io-client";

export type IUser = {
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  is_super_admin: boolean;
  last_login: string;
  first_name: string;
  last_name: string;
};

export enum OrganizationRoleType {
  ADMIN = "admin",
  ING_PREVENTA = "ing_preventa",
  USR_TECNICO = "usr_tecnico",
  OWNER = "owner",
  SUPERVISOR = "supervisor",
  HITL = "hitl",
  USER = "user",
}

export type WizardStatus =
  | "organization"
  | "department"
  | "agent"
  | "knowledge"
  | "chat"
  | "integration"
  | "link_web";

export type IOrganizarion = {
  id: number;
  role: OrganizationRoleType;
  organization: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    logo?: string | null;
    type: OrganizationType;
    wizardStatus?: WizardStatus;
    limitInfo?: {
      hasReachedLimit?: boolean;
      limit?: number;
      current?: number;
      daysRemaining?: number;
    };
  };
};

export type CustomSocket = Pick<
  Socket,
  "on" | "off" | "emit" | "disconnect"
> & {
  connected: boolean;
};

export interface IAuthState {
  authenticated: boolean;
  loading: boolean;
  socket: CustomSocket | null;
  user: IUser | null;
  selectOrganizationId: number | null;
  myOrganizations: IOrganizarion[];
}

export interface IConversation {
  id: number;
  messages: IMessage[];
  user: {
    id: number;
  };
  created_at: string;
}

export enum MessageFormatType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
}

export enum MessageType {
  USER = "user",
  AGENT = "agent",
  HITL = "hitl",
}

export interface IMessage {
  id: number;
  text: string;
  type: MessageType;
  format: MessageFormatType;
  audio: string | null;
  created_at: string;
  images?: string[];
}

export interface ImessageSocket extends IMessage {
  conversation: {
    id: number;
  };
}

export interface ConversationsState {
  conversations: IConversation[];
  lastMessage: ImessageSocket | null;
}
