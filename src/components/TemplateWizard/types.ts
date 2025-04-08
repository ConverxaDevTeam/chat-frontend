import { ParamType } from "@interfaces/function-params.interface";

export interface TemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;
}

// Importamos las interfaces de propiedades de parámetros
import { BaseParamProperty } from "@interfaces/function-params.interface";

export interface ParamConfigItem {
  id: string;
  name: string;
  enabled: boolean;
  value: string;
  type: ParamType;
  required: boolean;
  properties?: BaseParamProperty[];
}

export interface WizardFormValues {
  params: Record<string, ParamConfigItem>;
  authenticatorId?: number;
  customDomain?: string;
}
