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
} from "@interfaces/chatUsers";
import { toast } from "react-toastify";
import TablePagination from "@pages/Users/UsersSuperAdmin/components/TablePagination";
import { useDebounce } from "@hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

const ChatUsers = () => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [chatUsers, setChatUsers] = useState<IChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<ChatUserType | "">("");

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
        limit: ITEMS_PER_PAGE,
      };

      if (debouncedSearchTerm) filtersWithOrg.search = debouncedSearchTerm;
      if (selectedType) filtersWithOrg.type = selectedType as ChatUserType;

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
      } else {
        setChatUsers([]);
        setTotalPages(1);
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
  }, [selectOrganizationId, currentPage, debouncedSearchTerm, selectedType]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as ChatUserType | "");
    setCurrentPage(1);
  };

  return (
    <PageContainer loading={loading}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-sofia-superDark">
            Clientes
          </h1>
          <p className="text-gray-600">
            Gestiona los clientes de tu organización
          </p>
        </div>
        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
            />
          </div>
          <div className="w-48">
            <select
              value={selectedType}
              onChange={handleTypeFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value={ChatUserType.CHAT_WEB}>Chat Web</option>
              <option value={ChatUserType.WHATSAPP}>WhatsApp</option>
              <option value={ChatUserType.MESSENGER}>Messenger</option>
              <option value={ChatUserType.SLACK}>Slack</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="w-full border-spacing-0 mb-[16px]">
          <div className="h-[36px] text-[16px] flex">
            <div className="w-[20%]">
              <div className="flex gap-[10px] items-center pl-[16px]">
                <p className="font-medium leading-normal">Cliente</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark"
                />
              </div>
            </div>
            <div className="w-[25%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Email</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark"
                />
              </div>
            </div>
            <div className="w-[15%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Teléfono</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark"
                />
              </div>
            </div>
            <div className="w-[12%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Tipo</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark"
                />
              </div>
            </div>
            <div className="w-[15%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Registro</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark"
                />
              </div>
            </div>
            <div className="w-[13%]">
              <div className="flex gap-[10px] items-center">
                <p className="font-medium leading-normal">Último acceso</p>
                <img
                  src="/mvp/arrow-down-up.svg"
                  alt="Ordenar"
                  className="text-[#A6A8AB] cursor-pointer hover:text-sofia-superDark"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 shadow-sm">
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

          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
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
