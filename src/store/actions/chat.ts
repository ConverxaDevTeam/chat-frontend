import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDefaultDepartment } from "@services/department";
import { setWorkspaceData } from "@store/reducers/chat";

export const initializeWorkspace = createAsyncThunk(
  "chat/initializeWorkspace",
  async (organization: number, { dispatch }) => {
    try {
      const response = await getDefaultDepartment(organization);
      if (!response.ok || !response.department?.id) {
        throw new Error("No se pudo obtener la información del departamento");
      }

      const agent = response.department.agentes[0];
      if (!agent?.id) {
        throw new Error("No se encontró un agente en el departamento");
      }

      // Despachamos para actualizar el estado con la información del workspace
      dispatch(
        setWorkspaceData({
          department: {
            id: response.department.id,
          },
          agent: {
            id: agent.id,
            funciones: agent.funciones,
          },
          functions: agent.funciones || [],
        })
      );

      return response;
    } catch (error) {
      console.error("Error al inicializar el workspace:", error);
      throw error;
    }
  }
);
