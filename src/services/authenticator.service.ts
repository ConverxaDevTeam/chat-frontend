import { apiUrls } from "@config/config";
import { AuthenticatorType } from "@interfaces/autenticators.interface";

import { axiosInstance } from "@store/actions/auth";

type FormData = AuthenticatorType;

class AuthenticatorService {
  async fetchAll(organizationId: number) {
    const response = await axiosInstance.get<AuthenticatorType[]>(
      apiUrls.authenticators.byOrganization(organizationId)
    );
    return response.data;
  }

  async create(data: Omit<FormData, "id">) {
    const response = await axiosInstance.post<AuthenticatorType>(
      apiUrls.authenticators.base(),
      {
        ...data,
        life_time: 0,
        value: "",
        field_name: data.field_name || "Authorization",
      }
    );
    return response.data;
  }

  async update(id: number, data: FormData) {
    const response = await axiosInstance.patch<AuthenticatorType>(
      apiUrls.authenticators.byId(id),
      {
        ...data,
        field_name: data.field_name || "Authorization",
      }
    );
    return response.data;
  }

  async remove(id: number) {
    await axiosInstance.delete(apiUrls.authenticators.byId(id));
  }
}

export const authenticatorService = new AuthenticatorService();
