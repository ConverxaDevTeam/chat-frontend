import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import axios from "axios";

class FunctionsService {
  async create(data: FunctionData<HttpRequestFunction>) {
    const response = await axiosInstance.post<
      FunctionData<HttpRequestFunction>
    >(apiUrls.functions.base(), data);
    return response.data;
  }

  async getAll() {
    const response = await axiosInstance.get<
      FunctionData<HttpRequestFunction>[]
    >(apiUrls.functions.base());
    return response.data;
  }

  async update(id: number, data: Partial<FunctionData<HttpRequestFunction>>) {
    if (!data.agentId) {
      console.error("Agent ID is required", data);
      throw new Error("Agent ID is required");
    }
    const response = await axiosInstance.patch<
      FunctionData<HttpRequestFunction>
    >(apiUrls.functions.byId(id), data);
    return response.data;
  }

  async delete(id: number) {
    try {
      const response = await axiosInstance.delete(apiUrls.functions.byId(id));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        throw new Error(
          "Error interno del servidor. Por favor, inténtelo de nuevo más tarde."
        );
      }
      throw error;
    }
  }

  async getById(id: number) {
    const response = await axiosInstance.get<FunctionData<HttpRequestFunction>>(
      apiUrls.functions.byId(id)
    );
    return response.data;
  }

  async getByAgentId(agentId: number) {
    const response = await axiosInstance.get<
      FunctionData<HttpRequestFunction>[]
    >(apiUrls.functions.byAgent(agentId));
    return response.data;
  }

  async assignAuthenticator(
    functionId: number,
    authenticatorId: number | null
  ) {
    const response = await axiosInstance.patch<
      FunctionData<HttpRequestFunction>
    >(apiUrls.functions.assignAuthenticator(functionId), {
      authorizerId: authenticatorId === null ? null : authenticatorId,
    });
    return response.data;
  }

  async testEndpoint(functionId: number, params: Record<string, unknown>) {
    const response = await axiosInstance.post<unknown>(
      apiUrls.functions.testEndpoint(functionId),
      { params }
    );
    return {
      status: response.status,
      data: response.data,
    };
  }
}

export const functionsService = new FunctionsService();
