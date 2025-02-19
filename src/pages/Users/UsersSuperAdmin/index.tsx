import { useEffect, useState } from "react";
import { deleteGlobalUser, getGlobalUsers } from "@services/user";
import Table from "@components/Card/Table";
import TableHeader from "@components/Card/TableHeader";
import CardItem from "@components/Card/CardItem";
import { IUserApi } from "../UsersOrganization";
import PageContainer from "@components/PageContainer";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal"; // Modal de edición importado
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

interface Column {
  key: keyof IUserApi | "actions";
  label: string;
}

const columns: Column[] = [
  { key: "email", label: "Email" },
  { key: "first_name", label: "Nombre" },
  { key: "last_name", label: "Apellido" },
  { key: "userOrganizations", label: "Rol" },
  { key: "email_verified", label: "Verificado" },
  { key: "last_login", label: "Último Login" },
  { key: "actions", label: "Acciones" },
];

const UserRow = ({
  user,
  onDelete,
  onEdit,
}: {
  user: IUserApi;
  onDelete: (userId: number) => void;
  onEdit: (userId: number) => void;
}) => (
  <tr className="h-[60px] text-[14px] border-b-[1px] hover:bg-gray-50">
    <td className="px-4 py-2">{user.email}</td>
    <td className="px-4 py-2">{user.first_name || "-"}</td>
    <td className="px-4 py-2">{user.last_name || "-"}</td>
    <td className="px-4 py-2">
      {user.userOrganizations.map(org => org.role).join(", ")}
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
      <div className="flex gap-2">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => onEdit(user.id)} // Llama a la función de edición
        >
          Editar
        </button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => onDelete(user.id)}
        >
          Eliminar
        </button>
      </div>
    </td>
  </tr>
);

const UsersSuperAdmin = () => {
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para el modal de edición
  const [userToEdit, setUserToEdit] = useState<IUserApi | null>(null); // Estado para el usuario que se va a editar

  const { handleOperation, showConfirmation } = useAlertContext();

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
      text: "Esta seguro de eliminar este usuario?",
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
      setIsEditModalOpen(true); // Abre el modal de edición
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <PageContainer
      title="Usuarios"
      buttonText="Nuevo Usuario"
      onButtonClick={() => setIsCreateModalOpen(true)}
      loading={loading}
      appends={
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
        </>
      }
    >
      <Table>
        <TableHeader columns={columns} />
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onDelete={handleDelete}
              onEdit={handleEdit} // Pasa la función de edición
            />
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default UsersSuperAdmin;
