export interface CreateAgentDto {
  name: string;
  description?: string;
}

export interface Agent {
  id: number;
  name: string;
  config: {
    instruccion: string;
  }
}

export enum AgenteType {
  SOFIA_ASISTENTE = 'sofia_asistente',
  LLAMA = 'llama',
  GROK = 'grok',
  }

export enum AgentIdentifierType {
  CHAT = 'chat',
  THREAT = 'threat',
  TEST = 'test',
}

export interface ChatAgentIdentifier {
  chat_id: number;
  type: AgentIdentifierType.CHAT;
}

export interface TestAgentIdentifier {
  threat_id: string
  agent: AgenteType
  type: AgentIdentifierType.TEST
}

export type AgentIdentifier = ChatAgentIdentifier | TestAgentIdentifier;
