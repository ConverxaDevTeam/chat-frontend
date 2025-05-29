import { OrganizationRoleType } from "@utils/interfaces";

export interface ISelectOrganization {
  id: number;
  name: string;
}

export enum OrganizationType {
  PRODUCTION = "production",
  MVP = "mvp",
  FREE = "free"
}

export enum AgentType {
  SOFIA_ASISTENTE = "sofia_asistente",
  CLAUDE = "claude",
}

export type IOrganization = {
  id: number;
  logo?: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  type: OrganizationType;
  agentType?: AgentType;
  description: string;
  users: number;
  email?: string; 
  departments?: number; 
  owner?: {
    id: number;
    role: OrganizationRoleType;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
};
