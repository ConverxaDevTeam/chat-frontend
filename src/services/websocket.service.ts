import socketIO, { Socket } from "socket.io-client";
import { apiUrls } from "@config/config";

let websocket: Socket | null = null;

// Conectar al servidor WebSocket
export const connectWebSocket = (token: string): Socket | null => {
  if (websocket) {
    console.warn("WebSocket ya está conectado.");
    return websocket; // Retorna la instancia existente
  }

  websocket = socketIO(apiUrls.socket(), {
    path: "/api/events/socket.io",
    query: { token }, // Enviar token como parámetro
    transports: ["websocket"], // Usar solo WebSocket
  });

  websocket.on("connect", () => {
    console.log("Conectado al servidor WebSocket");
  });

  websocket.on("disconnect", (reason) => {
    console.log(`Desconectado del servidor WebSocket: ${reason}`);
    websocket = null; // Limpiar referencia al desconectar
  });

  return websocket;
};

// Desconectar del servidor WebSocket
export const disconnectWebSocket = async (): Promise<string | null> => {
  if (!websocket) {
    console.warn("No hay WebSocket para desconectar.");
    return null;
  }

  return new Promise((resolve) => {
    websocket!.disconnect(); // Cierra la conexión
    websocket!.on("disconnect", () => {
      const id = websocket!.id;
      websocket = null; // Limpia la referencia
      console.log("Desconexión completa");
      resolve(id ?? null);
    });
  });
};

// Escuchar eventos del servidor
export const onWebSocketEvent = (event: string, callback: (data: any) => void): void => {
  if (!websocket) {
    console.warn("WebSocket no está conectado.");
    return;
  }
  websocket.on(event, callback);
};

// Emitir eventos al servidor
export const emitWebSocketEvent = (event: string, data: any): void => {
  if (!websocket) {
    console.warn("WebSocket no está conectado.");
    return;
  }
  websocket.emit(event, data);
};

// Unirse a una sala
export const joinRoom = (roomName: string): void => {
  console.log("joinRoom", roomName);
  if (!websocket) {
    console.warn("WebSocket no está conectado.");
    return;
  }
  websocket.emit("join", roomName);
  console.log(`Cliente unido a la sala: ${roomName}`);
};

// Salir de una sala
export const leaveRoom = (roomName: string): void => {
  if (!websocket) {
    console.warn("WebSocket no está conectado.");
    return;
  }
  websocket.emit("leave", roomName);
  console.log(`Cliente salió de la sala: ${roomName}`);
};
