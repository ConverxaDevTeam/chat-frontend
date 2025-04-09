export enum ParamType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
}

// Interfaz base para evitar referencias circulares
export interface BaseParamProperty {
  name: string;
  type: ParamType;
  description?: string;
  required?: boolean;
}

// Interfaz con propiedades anidadas
export interface ObjectParamProperty extends BaseParamProperty {
  properties?: BaseParamProperty[];
}

export interface CreateFunctionParamDto {
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
  properties?: BaseParamProperty[];
}

export interface FunctionParam extends CreateFunctionParamDto {
  id: string;
}
