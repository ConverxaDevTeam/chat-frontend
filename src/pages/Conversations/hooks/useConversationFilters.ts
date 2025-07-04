import { useState, useEffect, useCallback } from "react";
import {
  ConversationFilters,
  ConversationListItem,
  ConversationListResponse,
  SortableFields,
  SortOrder,
} from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import { getConversationsByOrganizationId } from "@services/conversations";
import { useDebounce } from "@hooks/useDebounce";

interface UseConversationFiltersProps {
  organizationId: number;
}

interface UseConversationFiltersReturn {
  // Data
  conversations: ConversationListItem[];
  pagination: ConversationListResponse["pagination"];
  appliedFilters: ConversationFilters;

  // Loading states
  isLoading: boolean;
  isFilteringLoading: boolean;

  // Filter states
  filters: ConversationFilters;

  // Filter actions
  updateFilter: (
    key: keyof ConversationFilters,
    value:
      | string
      | boolean
      | number
      | IntegrationType
      | "ia"
      | "pendiente"
      | "asignado"
      | undefined
  ) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof ConversationFilters) => void;

  // Pagination actions
  goToPage: (page: number) => void;
  changeItemsPerPage: (limit: number) => void;

  // Sort actions
  updateSort: (field: SortableFields) => void;

  // Utility
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  refetch: () => void;
}

const DEFAULT_FILTERS: ConversationFilters = {
  page: 1,
  limit: 20,
  sortBy: SortableFields.CREATED_AT,
  sortOrder: SortOrder.DESC,
};

export const useConversationFilters = ({
  organizationId,
}: UseConversationFiltersProps): UseConversationFiltersReturn => {
  // State
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    []
  );
  const [pagination, setPagination] =
    useState<ConversationListResponse["pagination"]>();
  const [appliedFilters, setAppliedFilters] = useState<ConversationFilters>({});
  const [filters, setFilters] = useState<ConversationFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilteringLoading, setIsFilteringLoading] = useState(false);

  // Debounce search to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(filters.search || "", 500);

  // Fetch conversations
  const fetchConversations = useCallback(
    async (currentFilters: ConversationFilters, showLoading = true) => {
      try {
        if (showLoading) {
          if (currentFilters.page === 1) {
            setIsFilteringLoading(true);
          }
          setIsLoading(true);
        }

        const response = await getConversationsByOrganizationId(
          organizationId,
          currentFilters
        );

        if (response.ok) {
          setConversations(response.conversations);
          setPagination(response.pagination);
          setAppliedFilters(response.appliedFilters || currentFilters);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
        setPagination(undefined);
      } finally {
        setIsLoading(false);
        setIsFilteringLoading(false);
      }
    },
    [organizationId]
  );

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== (appliedFilters.search || "")) {
      const newFilters = {
        ...filters,
        search: debouncedSearchTerm,
        page: 1, // Reset to first page when searching
      };
      setFilters(newFilters);
      fetchConversations(newFilters);
    }
  }, [debouncedSearchTerm, filters, appliedFilters.search, fetchConversations]);

  // Initial load
  useEffect(() => {
    fetchConversations(DEFAULT_FILTERS);
  }, [fetchConversations]);

  // Filter actions
  const updateFilter = useCallback(
    (
      key: keyof ConversationFilters,
      value:
        | string
        | boolean
        | number
        | IntegrationType
        | "ia"
        | "pendiente"
        | "asignado"
        | undefined
    ) => {
      const newFilters = {
        ...filters,
        [key]: value,
        // Reset to first page when filter changes (except for page and limit)
        ...(key !== "page" && key !== "limit" && { page: 1 }),
      };

      setFilters(newFilters);

      // Don't fetch immediately for search (handled by debounce)
      if (key !== "search") {
        fetchConversations(newFilters);
      }
    },
    [filters, fetchConversations]
  );

  const clearFilters = useCallback(() => {
    const newFilters = { ...DEFAULT_FILTERS };
    setFilters(newFilters);
    fetchConversations(newFilters);
  }, [fetchConversations]);

  const clearFilter = useCallback(
    (key: keyof ConversationFilters) => {
      const newFilters = { ...filters };
      delete newFilters[key];

      // Reset to first page when clearing a filter
      if (key !== "page" && key !== "limit") {
        newFilters.page = 1;
      }

      setFilters(newFilters);
      fetchConversations(newFilters);
    },
    [filters, fetchConversations]
  );

  // Pagination actions
  const goToPage = useCallback(
    (page: number) => {
      updateFilter("page", page);
    },
    [updateFilter]
  );

  const changeItemsPerPage = useCallback(
    (limit: number) => {
      const newFilters = {
        ...filters,
        limit,
        page: 1, // Reset to first page when changing items per page
      };
      setFilters(newFilters);
      fetchConversations(newFilters);
    },
    [filters, fetchConversations]
  );

  // Sort actions
  const updateSort = useCallback(
    (field: SortableFields) => {
      const currentSortBy = filters.sortBy;
      const currentSortOrder = filters.sortOrder || SortOrder.DESC;

      let newSortOrder: SortOrder;

      if (currentSortBy === field) {
        // Toggle sort order if same field
        newSortOrder =
          currentSortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      } else {
        // Default to DESC for new field
        newSortOrder = SortOrder.DESC;
      }

      const newFilters = {
        ...filters,
        sortBy: field,
        sortOrder: newSortOrder,
        page: 1, // Reset to first page when sorting
      };

      setFilters(newFilters);
      fetchConversations(newFilters);
    },
    [filters, fetchConversations]
  );

  // Utility functions
  const hasActiveFilters = Boolean(
    filters.search ||
      filters.department ||
      filters.integrationType ||
      filters.status ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.type
  );

  const activeFiltersCount = [
    filters.search,
    filters.department,
    filters.integrationType,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
    filters.type,
  ].filter(Boolean).length;

  const refetch = useCallback(() => {
    fetchConversations(filters);
  }, [filters, fetchConversations]);

  return {
    // Data
    conversations,
    pagination,
    appliedFilters,

    // Loading states
    isLoading,
    isFilteringLoading,

    // Filter states
    filters,

    // Filter actions
    updateFilter,
    clearFilters,
    clearFilter,

    // Pagination actions
    goToPage,
    changeItemsPerPage,

    // Sort actions
    updateSort,

    // Utility
    hasActiveFilters,
    activeFiltersCount,
    refetch,
  };
};
