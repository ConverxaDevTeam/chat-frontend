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
  chat: {
    title: string;
    subtitle: string;
    description: string;
    welcomeMessage: string;
    placeholder: string;
  };
  integration: {
    domains: string[];
  };
}

export interface StepComponentProps {
  data: SetupFormData;
  updateData: (
    section: keyof SetupFormData,
    data: Partial<SetupFormData[keyof SetupFormData]>
  ) => void;
  organizationId: number | null;
  departmentId: number | null;
  agentId: number | null;
  integrationId: number | null;
  setIntegrationId: (id: number) => void;
  onComplete?: () => void;
  onClose?: () => void;
}

export type SetupStepId =
  | "organization"
  | "department"
  | "agent"
  | "knowledge"
  | "chat"
  | "integration"
  | "final";

export type TabStatus = "completed" | "current" | "pending";

export interface SetupTab {
  id: SetupStepId;
  label: string;
  status?: TabStatus;
}
