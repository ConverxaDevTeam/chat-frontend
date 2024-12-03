import { NodeData } from "./workflow";

enum FunctionNodeTypes {
  HTTP_REQUEST = "httpRequest",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface HttpRequestFunction {
  type: FunctionNodeTypes.HTTP_REQUEST;
  config: {
    url?: string;
    method?: HttpMethod;
    requestBody?: Record<string, unknown>;
  };
}

export interface FunctionData<
  T extends { type: string; config: Record<string, unknown> },
> extends NodeData {
  functionId: number;
  type: T["type"];
  config: T["config"];
}
