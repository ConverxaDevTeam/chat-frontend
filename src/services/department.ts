import { apiUrls } from "@config/config";
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
        autenticador: {
          id: number;
        };
      }>;
    };
  };
}

export const getDefaultDepartment = async (organization: number) => {
  try {
    const response = await axiosInstance.get<DepartmentResponse>(
      apiUrls.departments.default(organization)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching default department:", error);
    throw error;
  }
};
