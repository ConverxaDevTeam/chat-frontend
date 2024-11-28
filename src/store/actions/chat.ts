import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDefaultDepartment } from "@services/department";
import { setConnectionStatus, setWorkspaceData } from "@store/reducers/chat";
import { joinRoom } from "@services/websocket.service";

export const initializeWorkspace = createAsyncThunk(
  "chat/initializeWorkspace",
  async (organization: number, { dispatch }) => {
    try {
      const response = await getDefaultDepartment(organization);
      
      if (!response.ok || !response.department || !response.chat || !response.agents?.[0]) {
        throw new Error('No se pudo obtener la información del departamento');
      }

      // Despachamos para actualizar el estado con la información del workspace
      dispatch(setWorkspaceData({
        department: {
          id: response.department.id,
        },
        chat: {
          id: response.chat.id,
        },
        agent: {
          id: response.agents[0].id,
        }
      }));
      dispatch(setConnectionStatus(true));

      // Unirse al room de chat dinámico
      const roomName = `test-chat-${response.agents[0].id}`;
      joinRoom(roomName);

      console.log(`Se unió al room: ${roomName}`);

      return response;
    } catch (error) {
      console.error('Error al inicializar el workspace:', error);
      throw error;
    }
  }
);
