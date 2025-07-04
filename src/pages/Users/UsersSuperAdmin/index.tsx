import { useEffect, useState, useRef } from "react";
import { deleteGlobalUser, getGlobalUsers } from "@services/user";
import RoleBadge from "@components/RoleBadge";
import Table from "@components/Card/Table";
import TableHeader from "@components/Card/TableHeader";
import TableBody from "@components/Card/TableBody";
import { IUserApi } from "../UsersOrganization";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import Loading from "@components/Loading";
import TablePagination from "./components/TablePagination";
import UserFilter from "./components/UserFilter";
import usePagination from "./hooks/usePagination";
import useUserFilter from "./hooks/useUserFilter";
import ButtonExportAllUsers from "./ButtonExportAllUsers";
import ContextMenu from "@components/ContextMenu";

interface Column {
  key: keyof IUserApi | "actions" | "organizations";
  label: string;
}

const columns: Column[] = [
  { key: "email", label: "Email" },
  { key: "first_name", label: "Nombre" },
  { key: "last_name", label: "Apellido" },
  { key: "organizations", label: "Organizaciones" },
  { key: "userOrganizations", label: "Rol" },
  { key: "email_verified", label: "Verificado" },
  { key: "last_login", label: "Último Login" },
  { key: "actions", label: "Acciones" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_ITEMS_PER_PAGE = 10;

const UserRow = ({
  user,
  onDelete,
  onEdit,
}: {
  user: IUserApi;
  onDelete: (userId: number) => void;
  onEdit: (userId: number) => void;
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({
        x: rect.left - 130,
        y: rect.top,
      });
      setShowContextMenu(true);
    }
  };

  const handleCloseMenu = () => {
    setShowContextMenu(false);
  };

  const organizationNames = user.userOrganizations
    .filter(org => org.organization)
    .map(org => org.organization?.name)
    .filter(Boolean)
    .join(", ");

  const uniqueRoles = [...new Set(user.userOrganizations.map(org => org.role))];

  return (
    <>
      {showContextMenu && (
        <ContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={handleCloseMenu}
        >
          <button
            onClick={() => onEdit(user.id)}
            className="flex items-center gap-2 w-full text-left"
          >
            <img src="/mvp/pencil.svg" alt="Editar" className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex items-center gap-2 w-full text-left"
          >
            <img src="/mvp/trash.svg" alt="Eliminar" className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </ContextMenu>
      )}
      <tr className="h-[60px] text-[14px] border-b-[1px] hover:bg-gray-50">
        <td className="px-4 py-2">{user.email}</td>
        <td className="px-4 py-2">{user.first_name || "-"}</td>
        <td className="px-4 py-2">{user.last_name || "-"}</td>
        <td className="px-4 py-2">{organizationNames || "-"}</td>
        <td className="px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {uniqueRoles.map((role, index) => (
              <RoleBadge key={index} role={role} />
            ))}
          </div>
        </td>
        <td className="px-4 py-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              user.email_verified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.email_verified ? "Verificado" : "No Verificado"}
          </span>
        </td>
        <td className="px-4 py-2">
          {user.last_login
            ? new Date(user.last_login).toLocaleDateString()
            : "Nunca"}
        </td>
        <td className="px-4 py-2">
          <div className="flex justify-center">
            <button
              ref={menuButtonRef}
              onClick={handleOpenMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <img
                src="/mvp/three-dots.svg"
                alt="Opciones"
                className="w-5 h-5"
              />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

const UsersSuperAdmin = () => {
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IUserApi | null>(null);
  const { handleOperation, showConfirmation } = useAlertContext();

  const {
    searchTerm,
    setSearchTerm,
    selectedRole,
    isSearchOpen,
    setIsSearchOpen,
    filteredUsers,
    selectRole,
  } = useUserFilter(users);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedItems: currentUsers,
    goToPage,
    handleChangeItemsPerPage,
  } = usePagination(filteredUsers, DEFAULT_ITEMS_PER_PAGE);

  useEffect(() => {
    goToPage(1);
  }, [searchTerm, selectedRole]);

  const getAllUsers = async () => {
    try {
      const response = await getGlobalUsers();
      if (response) {
        setUsers(response);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    const result = await showConfirmation({
      title: "Eliminar usuario",
      text: "¿Está seguro de eliminar este usuario?",
    });
    if (!result) return;
    handleOperation(
      async () => {
        await deleteGlobalUser(userId);
        getAllUsers();
      },
      {
        title: "Eliminando usuario",
        successTitle: "Usuario eliminado",
        successText: "El usuario se ha eliminado correctamente",
        errorTitle: "Error al eliminar usuario",
      }
    );
  };

  const handleEdit = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToEdit(user);
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={getAllUsers}
      />
      {userToEdit && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={getAllUsers}
          userId={userToEdit.id}
        />
      )}

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-1 px-4 w-[190px] h-[41px] text-white rounded leading-[24px] bg-[#001130] hover:bg-opacity-90"
            aria-label="Crear nuevo usuario"
          >
            + Nuevo usuario
          </button>
          <div className="flex items-center gap-2">
            <ButtonExportAllUsers users={filteredUsers} />
            <UserFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              selectedRole={selectedRole}
              selectRole={selectRole}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-4 bg-transparent">
            <Loading />
          </div>
        ) : (
          <>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios que coincidan con tu búsqueda.
              </div>
            ) : (
              <>
                <div className="rounded overflow-hidden">
                  <Table>
                    <TableHeader columns={columns} />
                    <TableBody>
                      {currentUsers.map(user => (
                        <UserRow
                          key={user.id}
                          user={user}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onChangeItemsPerPage={handleChangeItemsPerPage}
                  rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UsersSuperAdmin;
