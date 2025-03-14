export const baseUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL;
export const urlFiles = import.meta.env.VITE_PUBLIC_URL_FILES;

export const apiUrls = {
  // auth
  refreshToken: () => `${baseUrl}/api/auth/refresh-token`,
  logOut: () => `${baseUrl}/api/auth/log-out`,
  logIn: () => `${baseUrl}/api/auth/log-in`,
  requestResetPassword: () => `${baseUrl}/api/auth/request-reset-password`,
  resetPassword: () => `${baseUrl}/api/auth/reset-password`,
  getSessions: () => `/api/auth/session`,
  deleteSession: (id: number) => `/api/auth/session/${id}`,
  //user
  getUser: () => `/api/user`,
  getGlobalUsers: () => `/api/user/global`,
  getUserMyOrganization: (organizationId: number) =>
    `/api/user/all/${organizationId}`,
  addUserInOrganizationById: (organizationId: number) =>
    `/api/user/add/${organizationId}`,
  deleteRole: (id: number) => `/api/user/role/${id}`,
  //organizations
  getOrganizations: () => `/api/organization`,
  createOrganization: () => `/api/organization`,
  deleteOrganization: (id: number) => `/api/organization/${id}`,
  editOrganization: (id: number) => `/api/organization/${id}`,
  updateOrganizationAgentType: (id: number) =>
    `/api/organization/${id}/agent-type`,
  myOrganizations: () => `/api/organization/my-organizations`,
  uploadOrganizationLogo: (id: number) => `/api/organization/${id}/logo`,
  deleteOrganizationLogo: (id: number) => `/api/organization/${id}/logo`,
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
  updateIntegrationLogo: (id: number) => `/api/integration/${id}/logo`,
  deleteIntegrationLogo: (id: number) => `/api/integration/${id}/logo`,
  deleteIntegrationbyId: (id: number) => `/api/integration/${id}/remove`,
  getPagesFacebook: (departmentId: number, organizationId: number) =>
    `/api/facebook/get-pages/${organizationId}/${departmentId}`, //xxx
  getChannelNameByIntegrationId: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/get-channel-name/${organizationId}/${departmentId}/${integrationId}`,
  updateIntegrationMessangerManual: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/update-messenger-manual/${organizationId}/${departmentId}/${integrationId}`,
  getIntegrationMessangerManual: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/get-messenger-manual/${organizationId}/${departmentId}/${integrationId}`,
  changeCodeIntegrationManual: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/change-manual-code/${organizationId}/${departmentId}/${integrationId}`,
  changeChannelName: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/change-channel-name/${organizationId}/${departmentId}/${integrationId}`,
  createIntegrationMessagerManual: (
    organizationId: number,
    departmentId: number
  ) =>
    `/api/integration/create-messager-manual/${organizationId}/${departmentId}`,
  createIntegrationWhatsAppManual: (
    organizationId: number,
    departmentId: number
  ) =>
    `/api/integration/create-whatsapp-manual/${organizationId}/${departmentId}`,
  getIntegrationWhatsAppManual: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/get-whatsapp-manual/organization/${organizationId}/departamento/${departmentId}/integration/${integrationId}`,
  updateIntegrationWhatsAppManual: (
    organizationId: number,
    departmentId: number,
    integrationId: number
  ) =>
    `/api/integration/update-whatsapp-manual/${organizationId}/${departmentId}/${integrationId}`,
  //conversations
  getConversationsByOrganizationId: (organizationId: number) =>
    `/api/conversation/organization/${organizationId}`,
  getIntegrations: (departmentId: number) =>
    `/api/integration/all/${departmentId}`,
  getConversationByOrganizationIdAndById: (
    organizationId: number,
    conversationId: number
  ) => `/api/conversation/${organizationId}/${conversationId}`,
  assignConversationToHitl: (conversationId: number) =>
    `/api/conversation/${conversationId}/assign-hitl`,
  reassignConversationToHitl: (conversationId: number) =>
    `/api/conversation/${conversationId}/reassign-hitl`,
  sendMessage: () => `/api/integration-router/send-message`,
  deleteConversation: (conversationId: number) =>
    `/api/conversation/${conversationId}`,
  //files
  mediaAudio: (audio: string) => `${urlFiles}/audio/${audio}`,
  // departments
  departments: {
    base: () => `/api/departments`,
    byId: (id: number) => `/api/departments/${id}`,
    default: (organizationId: number) =>
      `/api/departments/default/${organizationId}`,
    workspace: (departmentId: number) =>
      `/api/departments/${departmentId}/workspace`,
    all: (organizationId: number) =>
      `/api/departments/organization/${organizationId}`,
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
  // nodes
  nodes: {
    updateNodePosition: (nodeId: number) => `/api/nodes/${nodeId}/position`,
  },
  dashboardCards: {
    base: (organizationId: number | null) =>
      `/api/dashboard-cards/${organizationId ?? ""}`,
    byId: (cardId: number) => `/api/dashboard-cards/${cardId}`,
    layout: (relationId: number) => `/api/dashboard-cards/${relationId}/layout`,
  },
  analytics: {
    base: () => `/api/analytics`,
  },
  notifications: {
    base: () => `/api/notifications`,
    byId: (id: number) => `/api/notifications/${id}`,
    read: (id: number) => `/api/notifications/${id}/read`,
    readAll: () => `/api/notifications/read-all`,
    byOrganization: (organizationId: number) =>
      `/api/notifications/organization/${organizationId}`,
  },
} as const;

export const tokenAccess = {
  tokenName: import.meta.env.VITE_PUBLIC_TOKEN_NAME || "token",
  refreshTokenName:
    import.meta.env.VITE_PUBLIC_TOKEN_REFRESH_NAME || "refreshToken",
};
