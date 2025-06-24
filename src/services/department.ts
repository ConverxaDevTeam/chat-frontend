import { apiUrls } from "@config/config";
import { IDepartment } from "@interfaces/departments";
import { IntegrationType } from "@interfaces/integrations";
import { axiosInstance } from "@store/actions/auth";

interface DepartmentResponse {
  ok: boolean;
  department: {
    id: number;
    name: string;
    organizacion: {
      id: number;
    };
    agente: {
      id: number;
      funciones: Array<{
        id: number;
        name: string;
        config: {
          position: {
            x: number;
            y: number;
          };
        };
        autenticador: {
          id: number;
        };
      }>;
    };
    integrations: Array<{
      id: number;
      type: IntegrationType;
    }>;
  };
}

export const getDepartmentsDiagrams = async (organization: number) => {
  try {
    const response = await axiosInstance.get<DepartmentResponse>(
      apiUrls.departments.workspace(organization)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching default department:", error);
    throw error;
  }
};

export const getDepartments = async (organization: number) => {
  try {
    const response = await axiosInstance.get<IDepartment[]>(
      apiUrls.departments.all(organization)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

export const createDepartment = async (
  organization: number,
  name: string,
  description: string
) => {
  try {
    const response = await axiosInstance.post<IDepartment>(
      apiUrls.departments.base(),
      { name, description, organizacion_id: organization }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

export const updateDepartment = async (
  id: number,
  name: string,
  description: string
) => {
  try {
    const response = await axiosInstance.patch<IDepartment>(
      apiUrls.departments.byId(id),
      { name, description }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

export const deleteDepartment = async (id: number) => {
  try {
    await axiosInstance.delete(apiUrls.departments.byId(id));
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

export const getWorkspaceData = async (departmentId: number) => {
  try {
    const response = await axiosInstance.get<DepartmentResponse>(
      apiUrls.departments.workspace(departmentId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace data:", error);
    throw error;
  }
};
