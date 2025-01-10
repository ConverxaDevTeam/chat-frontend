import { useEffect, useState } from "react";
import { deleteGlobalUser, getGlobalUsers } from "@services/user";
import Table from "@components/Table/Table";
import TableHeader from "@components/Table/TableHeader";
import TableCell from "@components/Table/TableCell";
import { IUserApi } from "../UsersOrganization";
import PageContainer from "@components/PageContainer";
import CreateUserModal from "./CreateUserModal";
import { useSweetAlert } from "@hooks/useSweetAlert";

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
}: {
  user: IUserApi;
  onDelete: (userId: number) => void;
}) => (
  <tr className="h-[60px] text-[14px] border-b-[1px] hover:bg-gray-50">
    <TableCell>{user.email}</TableCell>
    <TableCell>{user.first_name || "-"}</TableCell>
    <TableCell>{user.last_name || "-"}</TableCell>
    <TableCell>
      {user.userOrganizations.map(org => org.role).join(", ")}
    </TableCell>
    <TableCell>
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          user.email_verified
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {user.email_verified ? "Verificado" : "No Verificado"}
      </span>
    </TableCell>
    <TableCell>
      {user.last_login
        ? new Date(user.last_login).toLocaleDateString()
        : "Nunca"}
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800">Editar</button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => onDelete(user.id)}
        >
          Eliminar
        </button>
      </div>
    </TableCell>
  </tr>
);

const UsersSuperAdmin = () => {
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleOperation, showConfirmation } = useSweetAlert();

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

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <PageContainer
      title="Usuarios"
      buttonText="Nuevo Usuario"
      onButtonClick={() => setIsModalOpen(true)}
      loading={loading}
      appends={
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={getAllUsers}
        />
      }
    >
      <Table>
        <TableHeader columns={columns} />
        <tbody>
          {users.map(user => (
            <UserRow key={user.id} user={user} onDelete={handleDelete} />
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default UsersSuperAdmin;
