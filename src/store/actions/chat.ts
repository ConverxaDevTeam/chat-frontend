import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDefaultDepartment } from "@services/department";
import { setWorkspaceData } from "@store/reducers/chat";

export const initializeWorkspace = createAsyncThunk(
  "chat/initializeWorkspace",
  async (organization: number, { dispatch }) => {
    try {
      const response = await getDefaultDepartment(organization);
      if (
        !response.ok ||
        !response.department?.id ||
        !response.department?.agentes?.[0]
      ) {
        throw new Error("No se pudo obtener la información del departamento");
      }

      // Despachamos para actualizar el estado con la información del workspace
      dispatch(
        setWorkspaceData({
          department: {
            id: response.department.id,
          },
          agent: {
            id: response.department.agentes[0].id,
          },
        })
      );

      return response;
    } catch (error) {
      console.error("Error al inicializar el workspace:", error);
      throw error;
    }
  }
);
