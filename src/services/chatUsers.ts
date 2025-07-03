import {
  IChatUsersResponse,
  IChatUsersFilters,
  IChatUser,
} from "@interfaces/chatUsers";
import { axiosInstance } from "@store/actions/auth";

export const getChatUsers = async (
  filters: IChatUsersFilters = {},
  includeMessages: boolean = false
): Promise<IChatUsersResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.organizationId)
      params.append("organizationId", filters.organizationId.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.needHuman !== undefined)
      params.append("needHuman", filters.needHuman.toString());
    if (filters.hasUnreadMessages !== undefined)
      params.append("hasUnreadMessages", filters.hasUnreadMessages.toString());
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (includeMessages) params.append("includeMessages", "true");

    const response = await axiosInstance.get(
      `/api/chat-user/all/info?${params.toString()}`
    );

    // Validate response structure
    if (!response.data) {
      return {
        ok: false,
        users: [],
        total: 0,
        page: 1,
        totalPages: 1,
      };
    }

    // Ensure response has expected structure
    const data = response.data;
    return {
      ok: data.ok !== false,
      users: Array.isArray(data.users) ? data.users : [],
      total: typeof data.total === "number" ? data.total : 0,
      page: typeof data.page === "number" ? data.page : 1,
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 1,
    };
  } catch (error) {
    console.error("Error fetching chat users:", error);
    // Return safe fallback instead of throwing
    return {
      ok: false,
      users: [],
      total: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

// Función para obtener TODOS los chat users con filtros aplicados (para export)
export const getAllChatUsersForExport = async (
  filters: IChatUsersFilters = {},
  includeMessages: boolean = false
): Promise<IChatUser[]> => {
  try {
    // Primero intentamos obtener todos con el límite máximo permitido
    const filtersWithHighLimit = {
      ...filters,
      limit: 100, // Límite máximo permitido por el backend
      page: 1,
    };

    const response = await getChatUsers(filtersWithHighLimit, includeMessages);

    if (response.ok) {
      // Si obtenemos todos los usuarios en una sola llamada
      if (response.users.length === response.total) {
        return response.users;
      }

      // Si hay más usuarios, hacemos múltiples llamadas
      const totalPages = response.totalPages || 1;
      const allUsers: IChatUser[] = [...response.users];

      // Hacer llamadas para las páginas restantes con límite de 100
      for (let page = 2; page <= totalPages; page++) {
        const pageFilters = {
          ...filters,
          page,
          limit: 100, // Usar el límite máximo permitido
        };

        const pageResponse = await getChatUsers(pageFilters, includeMessages);

        if (pageResponse.ok) {
          allUsers.push(...pageResponse.users);
        }
      }

      return allUsers;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener todos los chat users:", error);
    return [];
  }
};
