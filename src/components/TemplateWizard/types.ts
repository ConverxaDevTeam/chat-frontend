import { ParamType } from "@interfaces/function-params.interface";

export interface TemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;
}

export interface ParamConfigItem {
  id: string;
  name: string;
  enabled: boolean;
  value: string;
  type: ParamType;
  required: boolean;
}

export interface WizardFormValues {
  params: Record<string, ParamConfigItem>;
  authenticatorId?: number;
}
