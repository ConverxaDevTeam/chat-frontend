import { HttpMethod } from "./functions.interface";

export enum AutenticadorType {
  ENDPOINT = "endpoint",
  API_KEY = "api_key",
}

export enum ApiKeyInjectPlaces {
  HEADER = "header",
  QUERY_PARAM = "query_PARAMS",
}

export enum injectPlaces {
  BEARER_HEADER = "bearerHeader",
}

export interface BearerConfig {
  injectPlace: injectPlaces.BEARER_HEADER;
  injectConfig: {
    tokenPath: string;
    refreshPath: string;
  };
}

export interface HttpAutenticador<
  T extends {
    injectPlace: injectPlaces;
    injectConfig: Record<string, unknown>;
  },
> {
  type: AutenticadorType.ENDPOINT;
  config: {
    url: string;
    method: HttpMethod;
    params: Record<string, string>;
    injectPlace: T["injectPlace"];
    injectConfig: T["injectConfig"];
  };
}

export interface ApiKeyAutenticador {
  value: string;
  name: string;
  id?: number;
  type: AutenticadorType.API_KEY;
  config: {
    injectPlace: ApiKeyInjectPlaces;
    key: string;
  };
}

export interface Autenticador<
  T extends { type: AutenticadorType; config: Record<string, unknown> } = {
    type: AutenticadorType;
    config: Record<string, unknown>;
  },
> {
  life_time: number;
  value: string;
  name: string;
  field_name?: string;
  id?: number;
  organizationId: number;
  type: T["type"];
  config: T["config"];
}
