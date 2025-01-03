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
  getUserMyOrganization: (organizationId: number) =>
    `/api/user/all/${organizationId}`,
  addUserInOrganizationById: (organizationId: number) =>
    `/api/user/add/${organizationId}`,
  //organizations
  getOrganizations: () => `/api/organization`,
  createOrganization: () => `/api/organization`,
  myOrganizations: () => `/api/organization/my-organizations`,
  //socket
  socket: () => `${baseUrl}/api/socket`,
  //integrations
  createIntegrationWhatsApp: (departmentId: number, organizationId: number) =>
    `/api/facebook/create/${organizationId}/${departmentId}`,
  createIntegrationMessager: (departmentId: number, organizationId: number) =>
    `/api/facebook/create-messager/${organizationId}/${departmentId}`,
  getIntegrationWebChat: (departmentId: number, organizationId: number) =>
    `/api/integration/web-chat/${organizationId}/${departmentId}`,
  updateIntegrationWebChat: (id: number) => `/api/integration/web-chat/${id}`,
  //conversations
  getConversationsByOrganizationId: (organizationId: number) =>
    `/api/conversation/organization/${organizationId}`,
  getIntegrations: (departmentId: number, organizationId: number) =>
    `/api/integration/all/${organizationId}/${departmentId}`,
  getConversationByOrganizationIdAndById: (
    organizationId: number,
    conversationId: number
  ) => `/api/conversation/${organizationId}/${conversationId}`,
  //files
  mediaAudio: (audio: string) => `${urlFiles}/audio/${audio}`,
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
    escalateToHuman: (id: number) => `/api/agent/${id}/escalate-to-human`,
  },

  // functions
  functions: {
    base: () => `/api/functions`,
    byId: (id: number) => `/api/functions/${id}`,
    byAgent: (agentId: number) => `/api/functions/agent/${agentId}`,
    paramsBase: (functionId: number) =>
      `/api/functions/${functionId}/parameters`,
    assignAuthenticator: (functionId: number) =>
      `/api/functions/${functionId}/assign-authorizer`,
    testEndpoint: (functionId: number) => `/api/functions/test/${functionId}`,
  },

  // authenticators
  authenticators: {
    base: () => `/api/autenticadores`,
    byId: (id: number) => `/api/autenticadores/${id}`,
    byOrganization: (organizationId: number) =>
      `/api/autenticadores/${organizationId}`,
  },

  // knowledge base
  knowledgeBase: {
    base: () => `/api/agent-knowledgebase`,
    byId: (id: number) => `/api/agent-knowledgebase/${id}`,
    byAgent: (agentId: number) => `/api/agent-knowledgebase/agent/${agentId}`,
  },
} as const;

export const tokenAccess = {
  tokenName: import.meta.env.VITE_PUBLIC_TOKEN_NAME || "token",
  refreshTokenName:
    import.meta.env.VITE_PUBLIC_TOKEN_REFRESH_NAME || "refreshToken",
};
