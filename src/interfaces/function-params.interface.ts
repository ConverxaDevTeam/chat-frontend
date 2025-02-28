export enum ParamType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
}

export interface ObjectParamProperty {
  name: string;
  type: ParamType;
  description?: string;
  required?: boolean;
  properties?: ObjectParamProperty[];
}

export interface CreateFunctionParamDto {
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
  properties?: ObjectParamProperty[];
}

export interface FunctionParam extends CreateFunctionParamDto {
  id: string;
}
