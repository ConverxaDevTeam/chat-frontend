import axiosInstance from "@config/axios";
import { apiUrls } from "@config/config";
import {
  Autenticador,
  HttpAutenticador,
  BearerConfig,
} from "@interfaces/autenticators.interface";

type AuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

class AuthenticatorService {
  async fetchAll(organizationId: number) {
    const response = await axiosInstance.get<AuthenticatorType[]>(
      apiUrls.authenticators.byOrganization(organizationId)
    );
    return response.data;
  }

  async create(data: Omit<AuthenticatorType, "id">) {
    const response = await axiosInstance.post<AuthenticatorType>(
      apiUrls.authenticators.base(),
      {
        ...data,
        life_time: 3600,
        value: "",
      }
    );
    return response.data;
  }

  async update(id: number, data: AuthenticatorType) {
    const response = await axiosInstance.patch<AuthenticatorType>(
      apiUrls.authenticators.byId(id),
      data
    );
    return response.data;
  }

  async remove(id: number) {
    await axiosInstance.delete(apiUrls.authenticators.byId(id));
  }
}

export const authenticatorService = new AuthenticatorService();
