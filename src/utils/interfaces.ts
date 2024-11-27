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

export type IOrganizarion = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
};

export type CustomSocket = Pick<Socket, "on" | "off" | "emit" | "disconnect"> & {
  connected: boolean;
};

export interface IAuthState {
  authenticated: boolean;
  loading: boolean;
  socket: CustomSocket | null;
  user: IUser | null;
  selectOrganizationId: number | null;
  organizations: IOrganizarion[];
}
