import { IChatUsersResponse, IChatUsersFilters } from "@interfaces/chatUsers";
import { axiosInstance } from "@store/actions/auth";

export const getChatUsers = async (
  filters: IChatUsersFilters = {}
): Promise<IChatUsersResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.organizationId)
      params.append("organizationId", filters.organizationId.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);

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
