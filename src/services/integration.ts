import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertConfirm, alertError } from "@utils/alerts";
import axios from "axios";

export const getIntegrationWebChat = async (
  departmentId: number,
  selectOrganizationId: number
) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getIntegrationWebChat(departmentId, selectOrganizationId)
    );
    if (response.data.ok) {
      return response.data.integration;
    } else {
      alertError(response.data.message);
      return null;
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
    return null;
  }
};

export const updateIntegrationWebChat = async (
  integrationId: number,
  data: {
    cors: string[];
    title: string;
    name: string;
    sub_title: string;
    description: string;
    bg_color: string;
    text_title: string;
    bg_chat: string;
    text_color: string;
    bg_assistant: string;
    bg_user: string;
    button_color: string;
    button_text: string;
    text_date: string;
    logo?: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.updateIntegrationWebChat(integrationId),
      data
    );
    if (response.data.ok) {
      alertConfirm("Se actualizó la configuración del chat");
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
    return [];
  }
};

export const getIntegrations = async (departmentId: number) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getIntegrations(departmentId)
    );
    if (response.data.ok) {
      return response.data.integrations;
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

export const updateIntegrationLogo = async (
  integrationId: number,
  logo: Blob
) => {
  try {
    const formData = new FormData();
    formData.append("logo", logo, "logo.svg");

    const response = await axiosInstance.post(
      apiUrls.updateIntegrationLogo(integrationId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.ok) {
      return true;
    }
    return false;
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

export const deleteIntegrationLogo = async (
  integrationId: number
): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(
      apiUrls.deleteIntegrationLogo(integrationId)
    );
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

export const deleteIntegrationbyId = async (
  integrationId: number
): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(
      apiUrls.deleteIntegrationbyId(integrationId)
    );
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

export const getChannelNameByIntegrationId = async (
  selectOrganizationId: number,
  departmentId: number,
  integrationId: number
) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getChannelNameByIntegrationId(
        selectOrganizationId,
        departmentId,
        integrationId
      )
    );
    if (response.data.ok) {
      return response.data.name;
    } else {
      alertError(response.data.message);
      return null;
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
    return null;
  }
};

export const changeChannelName = async (
  selectOrganizationId: number,
  departmentId: number,
  integrationId: number,
  channelName: string
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.changeChannelName(
        selectOrganizationId,
        departmentId,
        integrationId
      ),
      { name: channelName }
    );

    if (response.data.ok) {
      return true;
    }
    return false;
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

export const createIntegrationMessagerManual = async (
  organizationId: number,
  departmentId: number
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.createIntegrationMessagerManual(organizationId, departmentId),
      {}
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

export const getIntegrationMessangerManual = async (
  selectOrganizationId: number,
  departmentId: number,
  integrationId: number
) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getIntegrationMessangerManual(
        selectOrganizationId,
        departmentId,
        integrationId
      )
    );
    if (response.data.ok) {
      return response.data.integration;
    } else {
      alertError(response.data.message);
      return null;
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
    return null;
  }
};

export const changeCodeIntegrationManual = async (
  organizationId: number,
  departmentId: number,
  integrationId: number
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.changeCodeIntegrationManual(
        organizationId,
        departmentId,
        integrationId
      ),
      {}
    );
    if (response.data.ok) {
      return response.data.code_webhook;
    } else {
      return null;
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
    return null;
  }
};

export const updateIntegrationMessangerManual = async (
  selectOrganizationId: number,
  departmentId: number,
  integrationId: number,
  pageId: string,
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.updateIntegrationMessangerManual(
        selectOrganizationId,
        departmentId,
        integrationId
      ),
      { page_id: pageId, token: token }
    );

    if (response.data.ok) {
      return true;
    }
    return false;
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

export const createIntegrationWhatsAppManual = async (
  organizationId: number,
  departmentId: number
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.createIntegrationWhatsAppManual(organizationId, departmentId),
      {}
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

export const getIntegrationWhatsAppManual = async (
  selectOrganizationId: number,
  departmentId: number,
  integrationId: number
) => {
  try {
    const response = await axiosInstance.get(
      apiUrls.getIntegrationWhatsAppManual(
        selectOrganizationId,
        departmentId,
        integrationId
      )
    );
    if (response.data.ok) {
      return response.data.integration;
    } else {
      alertError(response.data.message);
      return null;
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
    return null;
  }
};

export const updateIntegrationWhatsAppManual = async (
  selectOrganizationId: number,
  departmentId: number,
  integrationId: number,
  data: {
    phone_number_id: string;
    waba_id: string;
    token: string;
  }
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.updateIntegrationWhatsAppManual(
        selectOrganizationId,
        departmentId,
        integrationId
      ),
      data
    );

    if (response.data.ok) {
      return true;
    }
    return false;
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
