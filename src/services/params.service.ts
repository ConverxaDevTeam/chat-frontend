import { apiUrls } from "@config/config";
import {
  FunctionParam,
  CreateFunctionParamDto,
} from "@interfaces/function-params.interface";
import { axiosInstance } from "@store/actions/auth";

class ParamsService {
  async create(data: CreateFunctionParamDto, functionId: number) {
    const response = await axiosInstance.post<FunctionParam>(
      `${apiUrls.functions.paramsBase(functionId)}`,
      data
    );
    return response.data;
  }

  async update(
    functionId: number,
    paramId: string,
    data: CreateFunctionParamDto
  ) {
    const response = await axiosInstance.patch<FunctionParam>(
      `${apiUrls.functions.paramsBase(functionId)}/${paramId}`,
      data
    );
    return response.data;
  }

  async delete(functionId: number, paramId: string) {
    const response = await axiosInstance.delete(
      `${apiUrls.functions.paramsBase(functionId)}/${paramId}`
    );
    return response.data;
  }

  async getAll(functionId: number) {
    const response = await axiosInstance.get<FunctionParam[]>(
      `${apiUrls.functions.paramsBase(functionId)}`
    );
    return response.data;
  }
}

export const paramsService = new ParamsService();
