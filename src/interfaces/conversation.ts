export enum ConversationType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export enum MessageType {
  USER = "user",
  AGENT = "agent",
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
}

export interface FormInputs {
  message: string;
}
