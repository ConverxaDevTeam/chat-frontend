import axiosInstance from "@config/axios";
import { apiUrls } from "@config/config";
import { AxiosResponse } from "axios";

export const createKnowledgeBase = async (
  agentId: number,
  file: File
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post(apiUrls.knowledgeBase.byAgent(agentId), formData);
};

export const getKnowledgeBaseByAgent = async (
  agentId: number
): Promise<AxiosResponse> => {
  return axiosInstance.get(apiUrls.knowledgeBase.byAgent(agentId));
};

export const getKnowledgeBaseById = async (
  id: number
): Promise<AxiosResponse> => {
  return axiosInstance.get(apiUrls.knowledgeBase.byId(id));
};

export const deleteKnowledgeBase = async (
  id: number
): Promise<AxiosResponse> => {
  return axiosInstance.delete(apiUrls.knowledgeBase.byId(id));
};
