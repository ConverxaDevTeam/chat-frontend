import axiosInstance from "@config/axios";
import { apiUrls } from "@config/config";
import { AxiosResponse } from "axios";

export const ALLOWED_FILE_EXTENSIONS = [
  "c",
  "cpp",
  "cs",
  "css",
  "doc",
  "docx",
  "go",
  "html",
  "java",
  "js",
  "json",
  "md",
  "pdf",
  "php",
  "pptx",
  "py",
  "rb",
  "sh",
  "tex",
  "ts",
  "txt",
] as const;

export const createKnowledgeBase = async (
  agentId: number,
  file: File
): Promise<AxiosResponse> => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (
    !fileExtension ||
    !ALLOWED_FILE_EXTENSIONS.includes(
      fileExtension as (typeof ALLOWED_FILE_EXTENSIONS)[number]
    )
  ) {
    throw new Error(
      `Tipo de archivo no permitido. Las extensiones permitidas son: ${ALLOWED_FILE_EXTENSIONS.join(", ")}`
    );
  }

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
