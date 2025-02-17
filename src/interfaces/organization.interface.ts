import { OrganizationRoleType } from "@utils/interfaces";

export interface ISelectOrganization {
  id: number;
  name: string;
}

export type IOrganization = {
  id: number;
  logo?: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  users: number;
  owner?: {
    id: number;
    role: OrganizationRoleType;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
};
