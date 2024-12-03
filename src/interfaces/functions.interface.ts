import { FunctionParam } from "./function-params.interface";
import { NodeData } from "./workflow";

export enum FunctionNodeTypes {
  API_ENDPOINT = "apiEndpoint",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface HttpRequestFunction {
  type: FunctionNodeTypes.API_ENDPOINT;
  config: {
    url?: string;
    method?: HttpMethod;
    requestBody?: FunctionParam[];
  };
}

export interface FunctionData<
  T extends { type: string; config: Record<string, unknown> },
> extends NodeData {
  functionId?: number;
  type: T["type"];
  config: T["config"];
}
