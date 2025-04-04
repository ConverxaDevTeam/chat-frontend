import { Autenticador } from "./autenticators.interface";

export interface FunctionTemplateCategory {
  id: number;
  name: string;
  description?: string;
}

export interface FunctionTemplateApplication {
  id: number;
  name: string;
  description?: string;
  image?: string;
  domain?: string;
  isDynamicDomain: boolean;
}

export enum FunctionTemplateParamType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  ENUM = "enum",
}

export interface FunctionTemplateParam {
  id: string;
  name: string;
  title: string;
  description: string;
  type: FunctionTemplateParamType;
  required: boolean;
  enumValues?: string[];
  defaultValue?: string | number | boolean;
}

export interface FunctionTemplate {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category?: FunctionTemplateCategory;
  applicationId: number;
  application?: FunctionTemplateApplication;
  tags: string[];
  authenticatorId?: number;
  authenticator?: Autenticador;
  url: string;
  method: string;
  bodyType: string;
  params: FunctionTemplateParam[];
  organizationId: number;
}

export interface CreateFunctionTemplateDto {
  name: string;
  description: string;
  categoryId: number;
  applicationId: number;
  tags: string[];
  authenticatorId?: number;
  url: string;
  params: FunctionTemplateParam[];
  organizationId: number;
}

export interface UpdateFunctionTemplateDto {
  name?: string;
  description?: string;
  categoryId?: number;
  applicationId?: number;
  tags?: string[];
  authenticatorId?: number;
  url?: string;
  method?: string;
  bodyType?: string;
  params?: FunctionTemplateParam[];
}
