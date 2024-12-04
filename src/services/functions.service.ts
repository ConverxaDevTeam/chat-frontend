import axiosInstance from "@config/axios";
import { apiUrls } from "@config/config";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

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
    const response = await axiosInstance.patch<
      FunctionData<HttpRequestFunction>
    >(apiUrls.functions.byId(id), data);
    return response.data;
  }

  async delete(id: number) {
    const response = await axiosInstance.delete(apiUrls.functions.byId(id));
    return response.data;
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
}

export const functionsService = new FunctionsService();
