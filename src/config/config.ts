export const baseUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL;
export const urlFiles = import.meta.env.VITE_PUBLIC_URL_FILES;

export const apiUrls = {
  // auth
  refreshToken: () => `${baseUrl}/api/auth/refresh-token`,
  logOut: () => `${baseUrl}/api/auth/log-out`,
  logIn: () => `${baseUrl}/api/auth/log-in`,
  getSessions: () => `/api/auth/session`,
  deleteSession: (id: number) => `/api/auth/session/${id}`,
  //user
  getUser: () => `/api/user`,
  //organizations
  getOrganizations: () => `/api/organization`,
  createOrganization: () => `/api/organization`,
  myOrganizations: () => `/api/organization/my-organizations`,
  //socket
  socket: () => `${baseUrl}/api/socket`,
  //web-chat
  getIntegrationWebChat: (departmentId: number, selectOrganizationId: number) =>
    `/api/integration/web-chat/${selectOrganizationId}/${departmentId}`,

  // departments
  departments: {
    base: () => `/api/departments`,
    byId: (id: number) => `/api/departments/${id}`,
    default: (organizationId: number) =>
      `/api/departments/default/${organizationId}`,
  },

  // agents
  agents: {
    base: () => `/api/agent`,
    byId: (id: number) => `/api/agent/${id}`,
    byDepartment: (departmentId: number) =>
      `/api/agent/department/${departmentId}`,
  },

  // functions
  functions: {
    base: () => `/api/functions`,
    byId: (id: number) => `/api/functions/${id}`,
    byAgent: (agentId: number) => `/api/functions/agent/${agentId}`,
    paramsBase: (functionId: number) =>
      `/api/functions/${functionId}/parameters`,
  },

  // authenticators
  authenticators: {
    base: () => `/api/autenticadores`,
    byId: (id: number) => `/api/autenticadores/${id}`,
    byOrganization: (organizationId: number) =>
      `/api/autenticadores/${organizationId}`,
  },
} as const;

export const tokenAccess = {
  tokenName: import.meta.env.VITE_PUBLIC_TOKEN_NAME || "token",
  refreshTokenName:
    import.meta.env.VITE_PUBLIC_TOKEN_REFRESH_NAME || "refreshToken",
};
