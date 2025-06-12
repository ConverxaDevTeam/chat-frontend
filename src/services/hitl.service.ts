import { apiUrls } from "@config/config";
import {
  HitlType,
  CreateHitlTypeRequest,
  UpdateHitlTypeRequest,
  AssignUsersToHitlTypeRequest,
} from "@interfaces/hitl.interface";
import { axiosInstance } from "@store/actions/auth";
import { alertError } from "@utils/alerts";
import axios from "axios";

export const getHitlTypes = async (
  organizationId: number
): Promise<HitlType[]> => {
  try {
    const response = await axiosInstance.get(
      apiUrls.hitl.types(organizationId)
    );
    return response.data || [];
  } catch (error) {
    let message = "Error al obtener tipos HITL";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
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

export const getHitlTypeById = async (
  organizationId: number,
  hitlTypeId: number
): Promise<HitlType | null> => {
  try {
    const response = await axiosInstance.get(
      apiUrls.hitl.typeById(organizationId, hitlTypeId)
    );
    return response.data;
  } catch (error) {
    let message = "Error al obtener tipo HITL";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
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

export const createHitlType = async (
  organizationId: number,
  data: CreateHitlTypeRequest
): Promise<HitlType | null> => {
  try {
    const response = await axiosInstance.post(
      apiUrls.hitl.types(organizationId),
      data
    );
    return response.data;
  } catch (error) {
    let message = "Error al crear tipo HITL";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
        if (error.response.status === 409) {
          message = "Ya existe un tipo HITL con este nombre";
        }
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

export const updateHitlType = async (
  organizationId: number,
  hitlTypeId: number,
  data: UpdateHitlTypeRequest
): Promise<HitlType | null> => {
  try {
    const response = await axiosInstance.patch(
      apiUrls.hitl.typeById(organizationId, hitlTypeId),
      data
    );
    return response.data;
  } catch (error) {
    let message = "Error al actualizar tipo HITL";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
        if (error.response.status === 409) {
          message = "Ya existe un tipo HITL con este nombre";
        }
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

export const deleteHitlType = async (
  organizationId: number,
  hitlTypeId: number
): Promise<boolean> => {
  try {
    await axiosInstance.delete(
      apiUrls.hitl.typeById(organizationId, hitlTypeId)
    );
    return true;
  } catch (error) {
    let message = "Error al eliminar tipo HITL";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
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

export const assignUsersToHitlType = async (
  organizationId: number,
  hitlTypeId: number,
  data: AssignUsersToHitlTypeRequest
): Promise<boolean> => {
  try {
    await axiosInstance.post(
      apiUrls.hitl.typeUsers(organizationId, hitlTypeId),
      data
    );
    return true;
  } catch (error) {
    let message = "Error al asignar usuarios";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
        if (error.response.status === 400) {
          message = "Uno o más usuarios no tienen rol HITL";
        }
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

export const removeUserFromHitlType = async (
  organizationId: number,
  hitlTypeId: number,
  userId: number
): Promise<boolean> => {
  try {
    await axiosInstance.delete(
      apiUrls.hitl.removeUserFromType(organizationId, hitlTypeId, userId)
    );
    return true;
  } catch (error) {
    let message = "Error al remover usuario";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || "Error del servidor";
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


