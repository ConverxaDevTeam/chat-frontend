export interface CreateAgentDto {
  name: string;
  description?: string;
}

export interface Agent {
  id: number;
  name: string;
  config: {
    instruccion: string;
  };
}

export enum AgenteType {
  SOFIA_ASISTENTE = "sofia_asistente",
  LLAMA = "llama",
  GROK = "grok",
}

export enum AgentIdentifierType {
  CHAT = "chat",
  CHAT_TEST = "chatTest",
  THREAT = "threat",
  TEST = "test",
}

export interface ChatAgentIdentifier {
  chatId?: number;
  type: AgentIdentifierType.CHAT | AgentIdentifierType.CHAT_TEST;
}

export interface TestAgentIdentifier {
  threatId: string;
  LLMAgentId: string;
  agentId: number;
  agent: AgenteType;
  type: AgentIdentifierType.TEST;
}

export interface KnowledgeBase {
  updated_at: string;
  id?: number;
  filename: string;
  vectorStoreId: string;
  expirationTime?: Date;
  agent_id?: number;
}

export type AgentIdentifier = ChatAgentIdentifier | TestAgentIdentifier;
