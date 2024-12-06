import { HttpMethod } from "./functions.interface";

export enum AutenticadorType {
  ENDPOINT = "endpoint",
  CONSTANT = "constant",
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

export interface Autenticador<
  T extends { type: AutenticadorType; config: Record<string, unknown> } = {
    type: AutenticadorType;
    config: Record<string, unknown>;
  },
> {
  life_time: number;
  value: string;
  name: string;
  id?: number;
  organizationId: number;
  type: T["type"];
  config: T["config"];
}
