export enum ParamType {
  STRING = "string",
  NUMBER = "number",
  ENUM = "enum",
  REGEX = "regex",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
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
