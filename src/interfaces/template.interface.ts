import { Autenticador } from "./autenticators.interface";
import { ParamType } from "./function-params.interface";
import { HttpMethod, BodyType } from "./functions.interface";

export interface FunctionTemplateCategory {
  id: number;
  name: string;
  description?: string;
}

export interface FunctionTemplateApplication {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  image: string;
  domain?: string;
  isDynamicDomain: boolean;
}

export interface FunctionTemplateParam {
  id: string;
  name: string;
  title: string;
  description: string;
  type: ParamType;
  required: boolean;
  enumValues?: string[];
  defaultValue?: string | number | boolean;
  properties?: FunctionTemplateParam[];
  value?: string;
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
  method: HttpMethod;
  bodyType: BodyType;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  params: FunctionTemplateParam[];
}

export interface CreateFunctionTemplateDto {
  name: string;
  description: string;
  categoryId: number;
  applicationId: number;
  tags: string[];
  authenticatorId?: number;
  url: string;
  method?: HttpMethod;
  bodyType?: BodyType;
  params: FunctionTemplateParam[];
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

export interface PaginatedTemplateResponse {
  data: FunctionTemplate[];
  total: number;
  page: number;
  limit: number;
}
