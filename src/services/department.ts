import axios from 'axios';

interface DepartmentResponse {
  ok: boolean;
  department: {
    id: number;
  };
  chat: {
    id: number;
  };
  agents: Array<{
    id: number;
  }>;
}

const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
export const getDefaultDepartment = async (organization:number) => {
  try {
    const response = await axios.get<DepartmentResponse>(
      `${BASE_URL}/api/departments/default/${organization}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching default department:', error);
    throw error;
  }
}
