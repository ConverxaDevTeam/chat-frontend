import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import axios from "axios";

export const getOrganizations = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getOrganizations());
    if (response.data.ok) {
      return response.data.organizations;
    } else {
      alertError(response.data.message);
      return [];
    }
  } catch (error) {
    let message = "Error inesperado";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    alertError(message);
    return [];
  }
};

export const createOrganization = async (data: {
  name: string;
  description: string;
  email: string;
}) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.createOrganization(),
      data
    );
    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    let message = "Error inesperado";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    alertError(message);
    return false;
  }
};

export const deleteOrganization = async (id: number) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteOrganization(id));
    return response.data.ok;
  } catch (error) {
    let message = "Error inesperado";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message =
          error.response.data?.message || "Error inesperado del servidor";
      } else if (error.request) {
        message = "No se pudo conectar con el servidor";
      } else {
        message = error.message;
      }
    }
    alertError(message);
    return false;
  }
};

export const editOrganization = async (
  id: number,
  data: { owner_id: number }
) => {
  try {
    const response = await axiosInstance.patch(
      apiUrls.editOrganization(id),
      data
    );
    if (!response.data.ok) {
      throw new Error(response.data.message || "Error al editar organización");
    }
    return true;
  } catch (error) {
    let message = "Error inesperado";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
        throw new Error(message);
      } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor");
      }
      throw error;
    }
    throw new Error(message);
  }
};

export const uploadOrganizationLogo = async (id: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await axiosInstance.post(
      apiUrls.uploadOrganizationLogo(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.ok;
  } catch (error) {
    alertError("Error al subir el logo");
    return false;
  }
};

export const deleteOrganizationLogo = async (id: number) => {
  try {
    const response = await axiosInstance.delete(
      apiUrls.deleteOrganizationLogo(id)
    );
    return response.data.ok;
  } catch (error) {
    alertError("Error al eliminar el logo");
    return false;
  }
};
