import axios from "axios";
import { baseUrl, tokenAccess } from "./config";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

const getToken = () => localStorage.getItem(tokenAccess.tokenName) || "";
const getRefreshToken = () =>
  localStorage.getItem(tokenAccess.refreshTokenName);

const isTokenExpired = (token: string, extraTimeInSeconds = 30) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime + extraTimeInSeconds;
  } catch {
    return true;
  }
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${baseUrl}/auth/refresh`, {
      refreshToken,
    });

    const { token } = response.data;
    localStorage.setItem(tokenAccess.tokenName, token);
    return token;
  } catch (error) {
    localStorage.removeItem(tokenAccess.tokenName);
    localStorage.removeItem(tokenAccess.refreshTokenName);
    window.location.href = "/login";
    throw error;
  }
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    let token = getToken();

    if (token && isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem(tokenAccess.tokenName);
      localStorage.removeItem(tokenAccess.refreshTokenName);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
