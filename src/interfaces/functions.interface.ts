import { FunctionParam } from "./function-params.interface";
import { NodeData } from "./workflow";
import { Node } from "@xyflow/react";

export enum FunctionNodeTypes {
  API_ENDPOINT = "apiEndpoint",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum BodyType {
  JSON = "json",
  FORM_DATA = "form-data",
}

export interface HttpRequestFunction {
  id: number;
  name: string;
  autenticador?: { id: number };
  type: FunctionNodeTypes.API_ENDPOINT;
  config: {
    url: string;
    method: HttpMethod;
    requestBody?: FunctionParam[];
    bodyType: BodyType;
  };
}

export interface FunctionData<
  T extends { type: string; config: Record<string, unknown> },
> extends NodeData {
  id?: number;
  autenticador?: { id: number };
  functionId?: number;
  agentId: number;
  description: string;
  type: T["type"];
  config: T["config"];
}

export interface FunctionNodeData<
  T extends { type: string; config: Record<string, unknown> },
> extends Node {
  data: FunctionData<T>;
}
