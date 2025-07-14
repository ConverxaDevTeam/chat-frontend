export interface SetupFormData {
  organization: {
    name: string;
    description: string;
    logo: File | null;
  };
  department: {
    name: string;
    description: string;
  };
  agent: {
    id?: number;
    name: string;
    instruction: string;
  };
  knowledge: {
    files: File[];
    urls: string[];
  };
  chatConfig: {
    title: string;
    subtitle: string;
    description: string;
    welcomeMessage: string;
    placeholder: string;
  };
  interface: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonStyle: "rounded" | "square";
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  };
  integration: {
    domains: string[];
  };
}

export interface StepComponentProps {
  data: SetupFormData;
  updateData: (section: keyof SetupFormData, data: any) => void;
  organizationId: number | null;
  departmentId: number | null;
  agentId: number | null;
  integrationId: number | null;
  setIntegrationId: (id: number) => void;
}

export type SetupStepId =
  | "organization"
  | "department"
  | "agent"
  | "knowledge"
  | "chat"
  | "interface"
  | "integration"
  | "final";

export type TabStatus = "completed" | "current" | "pending";

export interface SetupTab {
  id: SetupStepId;
  label: string;
  status?: TabStatus;
}
