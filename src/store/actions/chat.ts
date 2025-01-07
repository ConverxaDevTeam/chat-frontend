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

      const { agente } = response.department;
      if (!agente?.id) {
        throw new Error("No se encontró un agente en el departamento");
      }

      // Despachamos para actualizar el estado con la información del workspace
      dispatch(
        setWorkspaceData({
          department: {
            id: response.department.id,
          },
          agent: {
            id: agente.id,
          },
          functions: agente.funciones || [], // Asignamos las funciones directamente al estado
          integrations: response.department.integrations || [],
        })
      );

      return response;
    } catch (error) {
      console.error("Error initializing workspace:", error);
      throw error;
    }
  }
);
