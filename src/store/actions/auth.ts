import axios from "axios";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "@store/hooks";
import { apiUrls, baseUrl, tokenAccess } from "../../config/config";
import { alertConfirm, alertError } from "../../utils/alerts";
import { jwtDecode } from "jwt-decode";
import { connectWebSocket, disconnectWebSocket, joinRoom, onWebSocketEvent } from "@services/websocket.service";
import { addMessage, setAgentId, setConnectionStatus } from "@store/reducers/chat";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
});

let interceptor = 0;

const getToken = () => {
  return localStorage.getItem(tokenAccess.tokenName) || "";
};

const getRefreshToken = () => {
  return localStorage.getItem(tokenAccess.refreshTokenName);
};

const validateToken = async () => {
  if (!getToken() || !getRefreshToken()) {
    return false;
  }
  if (isRefreshTokenAboutToExpire()) {
    return false;
  }
  if (isTokenAboutToExpire()) {
    const updated = await updatedToken();
    if (!updated) {
      return false;
    }
  }
  return true;
};

const updatedToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }
  try {
    const response = await axios.post(apiUrls.refreshToken(), {
      refresh_token: refreshToken,
    });
    if (response.data.ok) {
      localStorage.setItem(tokenAccess.tokenName, response.data.token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const isTokenAboutToExpire = (extraTimeInSeconds = 30) => {
  const token = getToken();
  if (!token) {
    return true;
  }
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  const expirationTime = decodedToken.exp;
  if (expirationTime !== undefined) {
    return expirationTime - currentTime <= extraTimeInSeconds;
  } else {
    return true;
  }
};

const deleteAccess = async () => {
  try {
    if (await validateToken()) {
      await axios.post(
        apiUrls.logOut(),
        {},
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    }
  } finally {
    localStorage.removeItem(tokenAccess.tokenName);
    localStorage.removeItem(tokenAccess.refreshTokenName);
    localStorage.removeItem("organizationSelect");
  }
};

const isRefreshTokenAboutToExpire = (extraTimeInSeconds = 30) => {
  const refreshtoken = getRefreshToken();
  if (!refreshtoken) {
    return true;
  }
  const decodedToken = jwtDecode(refreshtoken);
  const currentTime = Date.now() / 1000;
  const expirationTime = decodedToken.exp;
  if (expirationTime !== undefined) {
    return expirationTime - currentTime <= extraTimeInSeconds;
  } else {
    return true;
  }
};

export const logOutAsync = createAsyncThunk(
  "auth/logOutAsync",
  async (_, { rejectWithValue }) => {
    try {
      await deleteAccess();
      return {};
    } catch (error) {
      rejectWithValue("error");
    } finally {
      if (interceptor) {
        axiosInstance.interceptors.response.eject(interceptor);
      }
    }
  }
);

const setupAxiosInterceptors = (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  interceptor = axiosInstance.interceptors.request.use(
    async config => {
      try {
        const token = getToken();
        const refreshToken = getRefreshToken();
        if (!token || !refreshToken) {
          await disconnectSocketAndLogOut(dispatch);
        } else if (isRefreshTokenAboutToExpire()) {
          await disconnectSocketAndLogOut(dispatch);
        } else if (isTokenAboutToExpire()) {
          const response = await axios.post(apiUrls.refreshToken(), {
            refresh_token: refreshToken,
          });
          if (response.data.ok) {
            config.headers["Authorization"] = `Bearer ${response.data.token}`;
            localStorage.setItem(tokenAccess.tokenName, response.data.token);
          } else {
            await disconnectSocketAndLogOut(dispatch);
          }
        } else {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        return Promise.reject(error);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

export const getUserAsync = createAsyncThunk(
  "auth/getUserAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrls.getUser());
      if (response.data.ok) {
        return response.data;
      } else {
        return rejectWithValue("error");
      }
    } catch (error) {
      deleteAccess();
      return rejectWithValue("error");
    }
  }
);

export const getMyOrganizationsAsync = createAsyncThunk(
  "auth/getMyOrganizationsAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrls.myOrganizations());
      if (response.data.ok) {
        return response.data.organizations;
      } else {
        return rejectWithValue("error");
      }
    } catch (error) {
      deleteAccess();
      return rejectWithValue("error");
    }
  }
);

export const logInAsync = createAsyncThunk(
  "auth/logInAsync",
  async (
    {
      data,
      setActive,
      setError,
      dispatch,
    }: {
      data: {
        email: string;
        password: string;
      };
      setActive: (boolean: boolean) => void;
      setError: (error: string) => void;
      dispatch: ReturnType<typeof useAppDispatch>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(apiUrls.logIn(), data);
      if (response.data.ok) {
        localStorage.setItem(tokenAccess.tokenName, response.data.token);
        localStorage.setItem(
          tokenAccess.refreshTokenName,
          response.data.refreshToken
        );
        setupAxiosInterceptors(dispatch);
        dispatch(connectSocketAsync({ dispatch }));
        alertConfirm("Sesión iniciada correctamente");
        dispatch(getUserAsync());
        dispatch(getMyOrganizationsAsync());
        return {};
      } else {
        setError(response.data.message);
        return rejectWithValue("error");
      }
    } catch (error) {
      let message = "Error al iniciar sesión";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          message =
            error.response.data?.message || "Error inesperado del servidor";
        } else if (error.request) {
          message = "No se pudo conectar con el servidor";
        } else {
          message = error.message;
        }
      }
      setError(message);
      return rejectWithValue("error");
    } finally {
      setActive(false);
    }
  }
);

export const verifySessionAsync = createAsyncThunk(
  "auth/verifySessionAsync",
  async (
    {
      dispatch,
    }: {
      dispatch: ReturnType<typeof useAppDispatch>;
    },
    { rejectWithValue }
  ) => {
    const selectOrganizationId = localStorage.getItem("organizationSelect")
      ? Number(localStorage.getItem("organizationSelect"))
      : null;
    dispatch(setOrganizationId(selectOrganizationId));
    if (!(await validateToken())) {
      await deleteAccess();
      return rejectWithValue("error");
    }
    try {
      setupAxiosInterceptors(dispatch);
      dispatch(connectSocketAsync({ dispatch }));
      dispatch(getUserAsync());
      dispatch(getMyOrganizationsAsync());
      return {};
    } catch (error) {
      await deleteAccess();
      return rejectWithValue("error");
    }
  }
);

export const getSessionId = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken = jwtDecode<any>(token);
  return decodedToken.sessionId;
};

export const getSessions = async (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  try {
    const response = await axiosInstance.get(apiUrls.getSessions());
    if (response.data.ok) {
      return response.data.sessions;
    } else {
      alertError("Error al obtener sesiones");
      dispatch(logOutAsync());
      return [];
    }
  } catch (error) {
    alertError("Error al obtener sesiones");
    dispatch(logOutAsync());
    return [];
  }
};

export const deleteSessionById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteSession(id));
    if (response.data.ok) {
      alertConfirm("Sesión eliminada");
      return true;
    } else {
      alertError("Error al eliminar sesión");
      return false;
    }
  } catch (error) {
    alertError("Error al obtener sesiones");
    return false;
  }
};

export const getMySessions = async (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  try {
    const response = await axiosInstance.get(apiUrls.getSessions());
    if (response.data.ok) {
      return response.data.sessions;
    } else {
      alertError("Error al obtener sesiones");
      dispatch(logOutAsync());
      return [];
    }
  } catch (error) {
    alertError("Error al obtener sesiones");
    dispatch(logOutAsync());
    return [];
  }
};

export const disconnectSocketAndLogOut = async (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  dispatch(logOutAsync());
  dispatch(disconnectSocketAsync());
};

export const disconnectSocketAsync = createAsyncThunk(
  "auth/disconnectSocketAsync",
  async (_, { rejectWithValue }) => {
    try {
      const websocket = await disconnectWebSocket();
      if (websocket) {
        return websocket;
      } else {
        return rejectWithValue("error");
      }
    } catch (error) {
      return rejectWithValue("error");
    }
  }
);

export const connectSocketAsync = createAsyncThunk(
  "auth/connectSocketAsync",
  async (
    { dispatch }: { dispatch: ReturnType<typeof useAppDispatch> },
    { rejectWithValue }
  ) => {
    try {
      // Obtener el token del almacenamiento local
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No se encontró el token");
      }

      // Conectarse al WebSocket
      const websocket = connectWebSocket(token);

      if (websocket) {

        // Escuchar eventos del WebSocket
        onWebSocketEvent("message", (message) => {
          // Si el mensaje es un update del usuario, actualizamos el estado global
          if (message.action === "update-user") {
            dispatch(getUserAsync());
          }
        });

        return websocket; // Devolvemos el websocket si la conexión fue exitosa
      } else {
        return rejectWithValue("Error al conectar el WebSocket");
      }
    } catch (error) {
      console.error("Error al conectar el WebSocket:", error);
      return rejectWithValue("Error al conectar el WebSocket");
    }
  }
);


export const setOrganizationId = createAction(
  "auth/setOrganizationId",
  (payload: number | null) => {
    if (payload === null) {
      localStorage.removeItem("organizationSelect");
    } else {
      localStorage.setItem("organizationSelect", String(payload));
    }
    return { payload };
  }
);
export const connectToAgentRoom = createAsyncThunk(
  "chat/connectToAgentRoom",
  async (_, { dispatch }) => {
    const agentId = "123"; // ID del agente (esto normalmente vendría de Redux o de otro lado)

    // Despachamos para actualizar el estado con el agentId y conectar
    dispatch(setAgentId(agentId));
    dispatch(setConnectionStatus(true)); // Marcamos como conectado

    // Unirse al room de chat dinámico
    const roomName = `test-chat-${agentId}`;
    joinRoom(roomName); // Llamamos a la función joinRoom para unirse al room

    console.log(`Se unió al room: ${roomName}`);
    
    // Escuchar mensajes o eventos WebSocket
    onWebSocketEvent("message", (message) => {
      console.log("Mensaje recibido:", message);
      // Aquí agregamos el mensaje recibido al estado de Redux
      dispatch(addMessage({ sender: "agent", text: message }));
    });

    return roomName; // Puedes retornar el roomName si necesitas hacer algo con él en Redux
  }
);
