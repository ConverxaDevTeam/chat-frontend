export enum ConversationType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export enum MessageType {
  USER = "user",
  AGENT = "agent",
  HITL = "hitl",
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
  type: ConversationType;
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
  message_id: number;
  message_text: string;
  message_type: MessageType;
  message_created_at: string;
  need_human: boolean;
  type: ConversationType;
}

export interface ConversationListResponse {
  ok: boolean;
  message?: string;
  conversations: ConversationListItem[];
}
