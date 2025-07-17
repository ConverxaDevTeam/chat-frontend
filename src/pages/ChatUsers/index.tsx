import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import ChatUserCard from "./ChatUserCard";
import { getChatUsers } from "@services/chatUsers";
import PageContainer from "@components/PageContainer";
import {
  IChatUser,
  IChatUsersFilters,
  ChatUserType,
  SortBy,
  SortOrder,
} from "@interfaces/chatUsers";
import { toast } from "react-toastify";
import TablePagination from "@pages/Users/UsersSuperAdmin/components/TablePagination";
import { useDebounce } from "@hooks/useDebounce";
import ButtonExportAllChatUsers from "./ButtonExportAllChatUsers";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_ITEMS_PER_PAGE = 10;

const ChatUsers = () => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [chatUsers, setChatUsers] = useState<IChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    DEFAULT_ITEMS_PER_PAGE
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<ChatUserType | "">("");
  const [needHuman, setNeedHuman] = useState<boolean | undefined>(undefined);
  const [hasUnreadMessages, setHasUnreadMessages] = useState<
    boolean | undefined
  >(undefined);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ASC");

  // Debounce search term with 400ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const getAllChatUsers = async (filters: IChatUsersFilters = {}) => {
    if (!selectOrganizationId) return;

    try {
      setLoading(true);
      const filtersWithOrg = {
        ...filters,
        organizationId: selectOrganizationId,
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearchTerm) filtersWithOrg.search = debouncedSearchTerm;
      if (selectedType) filtersWithOrg.type = selectedType as ChatUserType;
      if (needHuman !== undefined) filtersWithOrg.needHuman = needHuman;
      if (hasUnreadMessages !== undefined)
        filtersWithOrg.hasUnreadMessages = hasUnreadMessages;
      if (dateFrom) filtersWithOrg.dateFrom = dateFrom;
      if (dateTo) filtersWithOrg.dateTo = dateTo;
      filtersWithOrg.sortBy = sortBy;
      filtersWithOrg.sortOrder = sortOrder;

      const response = await getChatUsers(filtersWithOrg);
      if (response && response.ok) {
        // Validate and filter out invalid users
        const validUsers = (response.users || []).filter(
          user =>
            user &&
            user.standardInfo &&
            typeof user.standardInfo.id === "number"
        );
        setChatUsers(validUsers);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.total || validUsers.length);
      } else {
        setChatUsers([]);
        setTotalPages(1);
        setTotalItems(0);
        toast.error("No se pudieron cargar los clientes");
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
      setChatUsers([]);
      setTotalPages(1);
      toast.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllChatUsers();
  }, [
    selectOrganizationId,
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    selectedType,
    needHuman,
    hasUnreadMessages,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  ]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleChangeItemsPerPage = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as ChatUserType | "");
    setCurrentPage(1);
  };

  const handleNeedHumanFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNeedHuman(value === "" ? undefined : value === "true");
    setCurrentPage(1);
  };

  const handleUnreadMessagesFilter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setHasUnreadMessages(value === "" ? undefined : value === "true");
    setCurrentPage(1);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
    setCurrentPage(1);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
    setCurrentPage(1);
  };

  const handleSortByChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(newSortBy);
      setSortOrder("ASC");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setNeedHuman(undefined);
    setHasUnreadMessages(undefined);
    setDateFrom("");
    setDateTo("");
    setSortBy("name");
    setSortOrder("ASC");
    setCurrentPage(1);
  };

  return (
    <PageContainer loading={loading} title="Clientes" titleClassName="mt-1">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <p className="text-app-superDark">
            Gestiona los clientes de tu organización
          </p>
          <ButtonExportAllChatUsers
            appliedFilters={{
              organizationId: selectOrganizationId || undefined,
              search: debouncedSearchTerm || undefined,
              type: selectedType || undefined,
              needHuman: needHuman,
              hasUnreadMessages: hasUnreadMessages,
              dateFrom: dateFrom || undefined,
              dateTo: dateTo || undefined,
              sortBy: sortBy,
              sortOrder: sortOrder,
            }}
          />
        </div>
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Primera fila de filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-app-superDark mb-2">
                Buscar cliente
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-3 py-2 border border-app-lightGray rounded focus:outline-none focus:ring-1 focus:ring-app-lightGray focus:border-transparent"
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-app-superDark mb-2">
                Tipo de cliente
              </label>
              <select
                value={selectedType}
                onChange={handleTypeFilter}
                className="w-full px-3 py-2 border border-app-lightGray rounded focus:outline-none focus:ring-1 focus:ring-app-lightGray focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value={ChatUserType.CHAT_WEB}>Chat Web</option>
                <option value={ChatUserType.WHATSAPP}>WhatsApp</option>
                <option value={ChatUserType.MESSENGER}>Messenger</option>
                <option value={ChatUserType.SLACK}>Slack</option>
              </select>
            </div>
          </div>

          {/* Segunda fila de filtros */}
          <div className="flex gap-4">
            <div className="w-48">
              <label className="block text-sm font-medium text-app-superDark mb-2">
                Necesita asistencia
              </label>
              <select
                value={needHuman === undefined ? "" : needHuman.toString()}
                onChange={handleNeedHumanFilter}
                className="w-full px-3 py-2 border border-app-lightGray rounded focus:outline-none focus:ring-1 focus:ring-app-lightGray focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Necesita humano</option>
                <option value="false">No necesita humano</option>
              </select>
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-app-superDark mb-2">
                Mensajes no leídos
              </label>
              <select
                value={
                  hasUnreadMessages === undefined
                    ? ""
                    : hasUnreadMessages.toString()
                }
                onChange={handleUnreadMessagesFilter}
                className="w-full px-3 py-2 border border-app-lightGray rounded focus:outline-none focus:ring-1 focus:ring-app-lightGray focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Con mensajes no leídos</option>
                <option value="false">Sin mensajes no leídos</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-app-superDark mb-2">
                Fecha desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={handleDateFromChange}
                placeholder="Desde"
                className="w-full px-3 py-2 border border-app-lightGray rounded focus:outline-none focus:ring-1 focus:ring-app-lightGray focus:border-transparent"
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-app-superDark mb-2">
                Fecha hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={handleDateToChange}
                placeholder="Hasta"
                className="w-full px-3 py-2 border border-app-lightGray rounded focus:outline-none focus:ring-1 focus:ring-app-lightGray focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-app-superDark hover:text-red-600 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="w-full border-spacing-0 mb-[16px]">
          <div className="h-[36px] text-[16px] flex">
            <div className="w-[18%]">
              <div className="flex gap-[10px] items-center pl-[16px]">
                <p className="font-medium leading-normal">Cliente</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className={`cursor-pointer hover:text-app-superDark ${
                    sortBy === "name" ? "text-app-superDark" : "text-[#A6A8AB]"
                  }`}
                  onClick={() => handleSortByChange("name")}
                />
              </div>
            </div>
            <div className="w-[20%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Email</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className={`cursor-pointer hover:text-app-superDark ${
                    sortBy === "email" ? "text-app-superDark" : "text-[#A6A8AB]"
                  }`}
                  onClick={() => handleSortByChange("email")}
                />
              </div>
            </div>
            <div className="w-[12%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Teléfono</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className={`cursor-pointer hover:text-app-superDark ${
                    sortBy === "phone" ? "text-app-superDark" : "text-[#A6A8AB]"
                  }`}
                  onClick={() => handleSortByChange("phone")}
                />
              </div>
            </div>
            <div className="w-[10%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Tipo</p>
              </div>
            </div>
            <div className="w-[15%]">
              <div className="flex flex-col gap-1">
                <div className="flex gap-[10px] items-center">
                  <p className="font-medium leading-normal">
                    Última conversación
                  </p>
                  <img
                    src="/mvp/arrow-down-up.svg"
                    alt="Ordenar"
                    className={`cursor-pointer hover:text-app-superDark ${
                      sortBy === "last_activity"
                        ? "text-app-superDark"
                        : "text-[#A6A8AB]"
                    }`}
                    onClick={() => handleSortByChange("last_activity")}
                  />
                </div>
              </div>
            </div>
            <div className="w-[10%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Estado</p>
              </div>
            </div>
            <div className="w-[15%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Registro</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className={`cursor-pointer hover:text-app-superDark ${
                    sortBy === "created_at"
                      ? "text-app-superDark"
                      : "text-[#A6A8AB]"
                  }`}
                  onClick={() => handleSortByChange("created_at")}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded border border-app-lightGray">
            {chatUsers.length > 0 ? (
              chatUsers.map((chatUser, index) => (
                <ChatUserCard
                  key={chatUser?.standardInfo?.id || `chat-user-${index}`}
                  chatUser={chatUser}
                />
              ))
            ) : !loading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">No se encontraron clientes</p>
              </div>
            ) : null}
          </div>

          {chatUsers.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onChangeItemsPerPage={handleChangeItemsPerPage}
              rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            />
          )}
        </div>

        {/* Padding at the end */}
        <div className="pb-8"></div>
      </div>
    </PageContainer>
  );
};

export default ChatUsers;
