interface Organization {
  id: number;
  name: string;
}

interface UserOrganization {
  id: number;
  role: string;
  organization: Organization;
}

export interface UserResponse {
  id: number;
  email: string;
  email_verified: boolean;
  last_login: string | null;
  first_name: string | null;
  last_name: string | null;
  userOrganizations: UserOrganization[];
}
