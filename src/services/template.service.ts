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
      items: FunctionTemplate[];
      total: number;
      page: number;
      limit: number;
    }

    const response = await axiosInstance.get<TemplateResponse>(
      apiUrls.functionTemplates.base(),
      { params }
    );

    // Extraer el array de items de la respuesta
    if (
      response.data &&
      response.data.items &&
      Array.isArray(response.data.items)
    ) {
      return response.data.items;
    }
    // Si no hay items o no es un array, devolver array vacío
    console.warn("No se encontraron templates en la respuesta:", response.data);
    return [];
  } catch (error) {
    console.error("Error al obtener templates:", error);
    return [];
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
    return response.data;
  } catch {
    return null;
  }
};

/**
 * Crear un nuevo template
 */
export const createTemplate = async (
  template: CreateFunctionTemplateDto
): Promise<FunctionTemplate> => {
  const response = await axiosInstance.post<FunctionTemplate>(
    apiUrls.functionTemplates.base(),
    template
  );
  return response.data;
};

/**
 * Actualizar un template existente
 */
export const updateTemplate = async (
  id: number,
  updateData: UpdateFunctionTemplateDto
): Promise<FunctionTemplate | null> => {
  try {
    const response = await axiosInstance.patch<FunctionTemplate>(
      apiUrls.functionTemplates.byId(id),
      updateData
    );
    return response.data;
  } catch {
    return null;
  }
};

/**
 * Eliminar un template
 */
export const deleteTemplate = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(apiUrls.functionTemplates.byId(id));
    return true;
  } catch {
    return false;
  }
};

/**
 * Obtener todas las categorías disponibles
 */
export const getCategories = async (): Promise<FunctionTemplateCategory[]> => {
  const response = await axiosInstance.get<FunctionTemplateCategory[]>(
    apiUrls.functionTemplates.categories()
  );
  return response.data;
};

/**
 * Obtener todas las aplicaciones disponibles
 */
export const getApplications = async (): Promise<
  FunctionTemplateApplication[]
> => {
  const response = await axiosInstance.get<FunctionTemplateApplication[]>(
    apiUrls.functionTemplates.applications()
  );
  return response.data;
};

/**
 * Crear una nueva categoría
 */
export const createCategory = async (
  category: Omit<FunctionTemplateCategory, "id">
): Promise<FunctionTemplateCategory> => {
  const response = await axiosInstance.post<FunctionTemplateCategory>(
    apiUrls.functionTemplates.categories(),
    category
  );
  return response.data;
};

/**
 * Crear una nueva aplicación
 */
export const createApplication = async (
  application: Omit<FunctionTemplateApplication, "id">,
  imageFile?: File
): Promise<FunctionTemplateApplication> => {
  // Si hay un archivo de imagen, usar FormData
  if (imageFile) {
    const formData = new FormData();
    formData.append("name", application.name);
    if (application.description) {
      formData.append("description", application.description);
    }
    if (application.domain) formData.append("domain", application.domain);
    formData.append("isDynamicDomain", String(application.isDynamicDomain));
    formData.append("image", imageFile);
    const response = await axiosInstance.post<FunctionTemplateApplication>(
      apiUrls.functionTemplates.applications(),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } else {
    // Si no hay imagen, enviar como JSON normal (aunque no debería ocurrir ya que la imagen es requerida)
    const response = await axiosInstance.post<FunctionTemplateApplication>(
      apiUrls.functionTemplates.applications(),
      application
    );
    return response.data;
  }
};
