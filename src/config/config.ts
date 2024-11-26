export const baseUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL;

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
};

export const tokenAccess = {
  tokenName: import.meta.env.VITE_PUBLIC_TOKEN_NAME || "token",
  refreshTokenName:
    import.meta.env.VITE_PUBLIC_TOKEN_REFRESH_NAME || "refreshToken",
};
