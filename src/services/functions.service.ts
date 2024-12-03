import axiosInstance from "@config/axios";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL + "/api";

class FunctionsService {
  async create(data: FunctionData<HttpRequestFunction>) {
    const response = await axiosInstance.post<
      FunctionData<HttpRequestFunction>
    >(`${BASE_URL}/functions`, data);
    return response.data;
  }

  async getAll() {
    const response = await axiosInstance.get<
      FunctionData<HttpRequestFunction>[]
    >(`${BASE_URL}/functions`);
    return response.data;
  }

  async update(id: number, data: Partial<FunctionData<HttpRequestFunction>>) {
    const response = await axiosInstance.patch<
      FunctionData<HttpRequestFunction>
    >(`${BASE_URL}/functions/${id}`, data);
    return response.data;
  }

  async delete(id: number) {
    const response = await axiosInstance.delete(`${BASE_URL}/functions/${id}`);
    return response.data;
  }

  async getById(id: number) {
    const response = await axiosInstance.get<FunctionData<HttpRequestFunction>>(
      `${BASE_URL}/functions/${id}`
    );
    return response.data;
  }

  async getByAgentId(agentId: number) {
    const response = await axiosInstance.get<
      FunctionData<HttpRequestFunction>[]
    >(`${BASE_URL}/functions/agent/${agentId}`);
    return response.data;
  }
}

export const functionsService = new FunctionsService();
