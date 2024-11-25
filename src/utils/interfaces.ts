import { Socket } from "socket.io-client";

export enum ROLE_USER {
  ADMIN = "admin",
  USER = "user",
}

export type UserProps = {
  id: number;
  create: string;
  update: string;
  email: string;
  email_verified: boolean;
  role?: ROLE_USER;
  last_login: string;
  first_name: string;
  last_name: string;
  userOrganizations: [{ id: number; organization: { name: string } }];
};

export type CustomSocket = Pick<Socket, "on" | "off" | "emit" | "disconnect">;

export interface IAuthState {
  authenticated: boolean;
  loading: boolean;
  socket: CustomSocket | null;
  user: UserProps | null;
  selectOrganization: { id: number; name: string } | null;
  theme: string;
}
