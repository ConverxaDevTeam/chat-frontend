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
}

export interface ConversationListResponse {
  ok: boolean;
  message?: string;
  conversations: ConversationListItem[];
}

export const getConversationStatus = (
  need_human: boolean,
  user_id: number | null
): ConversationStatus => {
  if (user_id) return ConversationStatus.TAKEN;
  if (!need_human) return ConversationStatus.IA;
  return ConversationStatus.PENDING;
};
