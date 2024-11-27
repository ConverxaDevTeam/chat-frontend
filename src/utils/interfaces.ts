import { Socket } from "socket.io-client";

export type IUser = {
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  is_super_admin: boolean;
  last_login: string;
  first_name: string;
  last_name: string;
};

export enum OrganizationRoleType {
  OWNER = "owner",
  ADMIN = "admin",
  USER = "user",
}

export type IOrganizarion = {
  id: number;
  role: OrganizationRoleType;
  organization: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
  };
};

export type CustomSocket = Pick<Socket, "on" | "off" | "emit" | "disconnect">;

export interface IAuthState {
  authenticated: boolean;
  loading: boolean;
  socket: CustomSocket | null;
  user: IUser | null;
  selectOrganizationId: number | null;
  myOrganizations: IOrganizarion[];
}
