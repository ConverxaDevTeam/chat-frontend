export enum ParamType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

export interface CreateFunctionParamDto {
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
}

export interface FunctionParam extends CreateFunctionParamDto {
  id: string;
}
