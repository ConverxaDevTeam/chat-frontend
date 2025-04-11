import { toast } from "react-toastify";
import axios from "axios";
import {
  FunctionTemplate,
  FunctionTemplateApplication,
  FunctionTemplateCategory,
  CreateFunctionTemplateDto,
  UpdateFunctionTemplateDto,
} from "@interfaces/template.interface";
import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@config/config";

/**
 * Obtener templates con paginación y búsqueda
 */
export const getTemplates = async (
  params: {
    search?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<FunctionTemplate[]> => {
  try {
    // Definir el tipo correcto para la respuesta
    interface TemplateResponse {
      items: Array<FunctionTemplate & { tags: { name: string }[] }>;
      total: number;
      page: number;
      limit: number;
    }

    const response = await axiosInstance.get<TemplateResponse>(
      apiUrls.functionTemplates.base(),
      { params }
    );

    return (
      response.data?.items?.map(template => ({
        ...template,
        tags: template.tags.map(tag =>
          typeof tag === "object" ? (tag as { name: string }).name : tag
        ),
      })) || []
    );
  } catch (error) {
    throw handleServiceError(error, "Error al obtener templates");
  }
};

/**
 * Obtener un template por ID
 */
export const getTemplateById = async (
  id: number
): Promise<FunctionTemplate | null> => {
  try {
    const response = await axiosInstance.get<FunctionTemplate>(
      apiUrls.functionTemplates.byId(id)
    );

    const template = response.data;
    console.log("SERVICIO - Template completo:", template);
    console.log("SERVICIO - Estructura de params:", template.params);

    // Convertir tags a array de strings (extraer name de cada objeto)
    if (template.tags) {
      const tagsArray = Array.isArray(template.tags)
        ? template.tags
        : Object.values(template.tags);

      template.tags = tagsArray
        .map((tag: unknown) => (tag as { name: string }).name || "")
        .filter(Boolean);
    } else {
      template.tags = [];
    }

    return template;
  } catch (error) {
    throw handleServiceError(error, "Error al obtener template por ID");
  }
};

/**
 * Crear un nuevo template
 */
export const createTemplate = async (
  template: CreateFunctionTemplateDto
): Promise<FunctionTemplate> => {
  try {
    const response = await axiosInstance.post<FunctionTemplate>(
      apiUrls.functionTemplates.base(),
      template
    );
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Error al crear template");
  }
};

const handleServiceError = (error: unknown, defaultMessage: string): never => {
  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.message || defaultMessage
    : defaultMessage;
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

/**
 * Actualizar un template existente
 */
export const updateTemplate = async (
  templateId: number,
  template: UpdateFunctionTemplateDto
): Promise<FunctionTemplate> => {
  try {
    const { data } = await axiosInstance.put<FunctionTemplate>(
      apiUrls.functionTemplates.byId(templateId),
      template
    );
    return data;
  } catch (error) {
    throw handleServiceError(error, "Error al actualizar el template");
  }
};

/**
 * Eliminar un template
 */
export const deleteTemplate = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(apiUrls.functionTemplates.byId(id));
    return true;
  } catch (error) {
    throw handleServiceError(error, "Error al eliminar template");
  }
};

/**
 * Obtener todas las categorías disponibles
 */
export const getCategories = async (): Promise<FunctionTemplateCategory[]> => {
  try {
    const response = await axiosInstance.get<FunctionTemplateCategory[]>(
      apiUrls.functionTemplates.categories()
    );
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Error al obtener categorías");
  }
};

/**
 * Obtener todas las aplicaciones disponibles
 */
export const getApplications = async (): Promise<
  FunctionTemplateApplication[]
> => {
  try {
    const response = await axiosInstance.get<FunctionTemplateApplication[]>(
      apiUrls.functionTemplates.applications()
    );
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Error al obtener aplicaciones");
  }
};

/**
 * Obtener templates por aplicación
 */
export const getTemplatesByApplication = async (
  applicationId: number
): Promise<FunctionTemplate[]> => {
  try {
    interface PaginatedResponse {
      items: FunctionTemplate[];
      total: number;
      page: number;
      limit: number;
    }

    const response = await axiosInstance.get<PaginatedResponse>(
      apiUrls.functionTemplates.byApplication(applicationId)
    );

    // Extraer los items del objeto paginado
    return response.data.items || [];
  } catch (error) {
    throw handleServiceError(
      error,
      `Error al obtener templates de la aplicación ${applicationId}`
    );
  }
};

/**
 * Crear una nueva categoría
 */
export const createCategory = async (
  category: Omit<FunctionTemplateCategory, "id">
): Promise<FunctionTemplateCategory> => {
  try {
    const response = await axiosInstance.post<FunctionTemplateCategory>(
      apiUrls.functionTemplates.categories(),
      category
    );
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Error al crear categoría");
  }
};

/**
 * Crear una nueva aplicación
 */
export const createApplication = async (
  application: Omit<FunctionTemplateApplication, "id">,
  imageFile?: File
): Promise<FunctionTemplateApplication> => {
  try {
    if (imageFile) {
      const formData = new FormData();
      formData.append("name", application.name);
      if (application.description)
        formData.append("description", application.description);
      if (application.domain) formData.append("domain", application.domain);
      formData.append("isDynamicDomain", String(application.isDynamicDomain));
      formData.append("image", imageFile);

      const { data } = await axiosInstance.post<FunctionTemplateApplication>(
        apiUrls.functionTemplates.applications(),
        formData
      );
      return data;
    }

    const { data } = await axios.post<FunctionTemplateApplication>(
      apiUrls.functionTemplates.applications(),
      application
    );
    return data;
  } catch (error) {
    throw handleServiceError(error, "Error al crear la aplicación");
  }
};

/**
 * Generar un template con IA a partir de un texto
 */
export const generateTemplateWithAI = async (
  content: string,
  additionalMessage: string,
  domain?: string
): Promise<{
  data: {
    templates: FunctionTemplate[];
    totalLines: number;
    lastProcessedLine: number;
  };
}> => {
  try {
    console.log("[API] Enviando solicitud a generateWithAI");
    const response = await axiosInstance.post<{
      data: {
        templates: FunctionTemplate[];
        totalLines: number;
        lastProcessedLine: number;
      };
    }>(apiUrls.functionTemplates.generateWithAI(), {
      content,
      additionalMessage,
      domain,
    });

    // Verificar la estructura de la respuesta
    console.log("[API] Respuesta recibida:", {
      status: response.status,
      hasData: !!response.data,
      hasTemplate: !!response.data?.data?.templates,
      totalLines: response.data?.data?.totalLines,
      lastProcessedLine: response.data?.data?.lastProcessedLine,
    });

    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Error al generar template con IA");
  }
};

/**
 * Continuar la generación de un template con IA
 */
export const continueTemplateGenerationWithAI = async (
  content: string,
  additionalMessage: string,
  lastProcessedLine: number,
  templateId?: number,
  categoryId?: number,
  applicationId?: number,
  domain?: string,
  createdIds?: {
    applicationId?: string;
    categoryIds?: string[];
  }
): Promise<{
  data: { templates: FunctionTemplate[]; lastProcessedLine: number };
}> => {
  try {
    const response = await axiosInstance.post<{
      data: { templates: FunctionTemplate[]; lastProcessedLine: number };
    }>(
      apiUrls.functionTemplates.continueGenerateWithAI(),
      {
        content,
        additionalMessage,
        templateId,
        categoryId,
        applicationId,
        domain,
        lastProcessedLine,
        createdIds,
      },
      { timeout: 0 }
    );
    return response.data;
  } catch (error) {
    throw handleServiceError(
      error,
      "Error al continuar la generación del template con IA"
    );
  }
};
