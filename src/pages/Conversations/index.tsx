import { useEffect } from "react";
import ConversationCard from "./ConversationCard";
import { RiArrowUpDownFill } from "react-icons/ri";
import { SortableFields } from "@interfaces/conversation";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonExportAllConversations from "./ButtonExportAllConversations";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import { updateConversationCount } from "@store/reducers/auth";
import TablePagination from "@pages/Users/UsersSuperAdmin/components/TablePagination";
import { useConversationFilters } from "./hooks/useConversationFilters";
import ConversationFiltersComponent from "./components/ConversationFilters";

const Conversations = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );
  if (!organizationId) throw new Error("Organization ID not found");
  const {
    conversations,
    pagination,
    filters,
    appliedFilters,
    isLoading,
    isFilteringLoading,
    updateFilter,
    clearFilters,
    clearFilter,
    goToPage,
    changeItemsPerPage,
    updateSort,
    hasActiveFilters,
    activeFiltersCount,
    refetch,
  } = useConversationFilters({ organizationId });

  useEffect(() => {
    if (pagination) {
      dispatch(
        updateConversationCount({
          organizationId: organizationId,
          count: pagination.totalItems,
        })
      );
      dispatch(getMyOrganizationsAsync());
    }
  }, [pagination, dispatch, organizationId]);

  const handleUpdateConversation = () => {
    // Refetch data to get updated state from server
    refetch();
  };

  const handleViewAllChats = () => {
    if (conversations.length > 0) {
      navigate(`/conversations/detail/${conversations[0].id}`);
    } else {
      toast.info("No hay conversaciones disponibles");
    }
  };

  const handleSort = (field: SortableFields) => {
    updateSort(field);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-4 mb-5">
        <p className="text-xl font-semibold text-app-superDark flex items-center">
          Conversaciones
        </p>
        <div className="flex-1 flex justify-end gap-3">
          <button
            type="button"
            className="bg-app-electricGreen flex items-center justify-center rounded-[4px] w-[145px] h-[30px] p-2"
            onClick={handleViewAllChats}
          >
            <p className="text-[14px] font-medium text-app-superDark">
              Ver todos los chats
            </p>
          </button>
          <ButtonExportAllConversations appliedFilters={appliedFilters} />
        </div>
      </div>

      {/* Filters Component */}
      <ConversationFiltersComponent
        filters={filters}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        onClearFilter={clearFilter}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        isLoading={isFilteringLoading}
      />
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-[400px] md:min-w-[600px] lg:min-w-[900px] border-spacing-0 mb-[16px]">
          <div className="h-[36px] text-[14px] md:text-[16px] flex w-full">
            {/* Desktop Headers */}
            <div className="hidden lg:flex w-full">
              <div className="pl-[16px] w-[calc(100%/19*2)]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Usuario</p>
                </div>
              </div>
              <div className="w-[calc(100%/19*2)]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">ID</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.CREATED_AT)}
                  />
                </div>
              </div>
              <div className="w-[calc(100%/19*2)]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Departamento</p>
                </div>
              </div>
              <div className="w-[calc(100%/19*2)]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Estatus</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.NEED_HUMAN)}
                  />
                </div>
              </div>
              <div className="w-[calc(100%/19*2)]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Iniciado</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.CREATED_AT)}
                  />
                </div>
              </div>
              <div className="w-[calc(100%/19*5)]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">
                    Último mensaje
                  </p>
                </div>
              </div>
              <div className="w-[calc(100%/19*2)]">
                <div className="flex gap-[10px] items-center justify-center">
                  <p className="whitespace-normal break-words">Canal</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.TYPE)}
                  />
                </div>
              </div>
              <div className="w-[calc(100%/19*3)]">
                <div className="flex gap-[10px] items-center">
                  <p
                    className="whitespace-nowrap break-words"
                    title="Asistencia humana"
                  >
                    Asistencia humana
                  </p>
                </div>
              </div>
              <div className="w-[calc(100%/19*1)]">
                <div className="flex justify-center items-center pr-[16px]">
                  <p>Acciones</p>
                </div>
              </div>
            </div>

            {/* Tablet Headers */}
            <div className="hidden md:flex lg:hidden w-full">
              <div className="pl-[16px] w-[20%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Usuario</p>
                </div>
              </div>
              <div className="w-[15%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">ID</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.CREATED_AT)}
                  />
                </div>
              </div>
              <div className="w-[15%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Depto</p>
                </div>
              </div>
              <div className="w-[15%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Estado</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.NEED_HUMAN)}
                  />
                </div>
              </div>
              <div className="w-[15%]">
                <div className="flex gap-[10px] items-center justify-center">
                  <p className="whitespace-normal break-words">Canal</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.TYPE)}
                  />
                </div>
              </div>
              <div className="w-[10%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">HITL</p>
                </div>
              </div>
              <div className="w-[10%]">
                <div className="flex justify-center items-center pr-[16px]">
                  <p>Acciones</p>
                </div>
              </div>
            </div>

            {/* Mobile Headers */}
            <div className="flex md:hidden w-full">
              <div className="pl-[16px] w-[25%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Usuario</p>
                </div>
              </div>
              <div className="w-[15%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">ID</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.CREATED_AT)}
                  />
                </div>
              </div>
              <div className="w-[25%]">
                <div className="flex gap-[10px] items-center">
                  <p className="whitespace-normal break-words">Estado</p>
                  <RiArrowUpDownFill
                    className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark"
                    onClick={() => handleSort(SortableFields.NEED_HUMAN)}
                  />
                </div>
              </div>
              <div className="w-[20%]">
                <div className="flex gap-[10px] items-center justify-center">
                  <p className="whitespace-normal break-words">Canal</p>
                </div>
              </div>
              <div className="w-[15%]">
                <div className="flex justify-center items-center pr-[16px]">
                  <p>Acciones</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[4px] border border-app-lightGray border-inherit">
            {isLoading || isFilteringLoading ? (
              <div className="flex justify-center items-center p-4">
                <p>Cargando conversaciones...</p>
              </div>
            ) : conversations.length > 0 ? (
              conversations.map(conversation => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  onUpdateConversation={handleUpdateConversation}
                />
              ))
            ) : (
              <div className="flex justify-center items-center p-4">
                <p>No hay conversaciones disponibles</p>
              </div>
            )}
          </div>

          {pagination && pagination.totalItems > 0 && (
            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              goToPage={goToPage}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onChangeItemsPerPage={changeItemsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
