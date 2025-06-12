import Loading from "@components/Loading";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import {
  getUserMyOrganization,
  deleteUserFromOrganization,
  changeUserRole,
} from "../../../services/user";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { OrganizationRoleType } from "@utils/interfaces";
import Modal from "@components/Modal";
import ModalAddUser from "./ModalAddUser";
import ModalChangeRole from "./ModalChangeRole";
import { toast } from "react-toastify";

export interface IUserApi {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  email_verified: boolean;
  last_login: string | null;
  userOrganizations: {
    id?: number;
    role: OrganizationRoleType;
    organization: {
      id?: number;
      name?: string;
    } | null;
  }[];
}

const UsersOrganization = () => {
  const { selectOrganizationId, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const [modalAddUser, setModalAddUser] = useState<boolean>(false);
  const [modalEditUser, setModalEditUser] = useState<boolean>(false);
  const [modalChangeRole, setModalChangeRole] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUserApi | null>(null);
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const role = myOrganizations.find(
    organization => organization.organization?.id === selectOrganizationId
  )?.role;

  const getAllUsers = async () => {
    if (!selectOrganizationId) return;
    try {
      const response = await getUserMyOrganization(selectOrganizationId);
      if (response) {
        setUsers(response);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: IUserApi) => {
    if (role !== OrganizationRoleType.OWNER) {
      toast.error("No tienes permisos para realizar esta acción", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!selectOrganizationId) {
      toast.error("No se ha seleccionado una organización", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await deleteUserFromOrganization(
        selectOrganizationId,
        user.id
      );
      if (result.success) {
        toast.success(result.message || "Usuario eliminado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        await getAllUsers(); // Refrescar la lista
      }
    } catch (error) {
      toast.error("Error al eliminar usuario", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (user: IUserApi) => {
    setSelectedUser(user);
    setModalEditUser(true);
  };

  const handleChangeRole = (user: IUserApi) => {
    if (role !== OrganizationRoleType.OWNER) {
      toast.error("No tienes permisos para realizar esta acción", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const userRole = user.userOrganizations[0]?.role;
    if (
      userRole !== OrganizationRoleType.USER &&
      userRole !== OrganizationRoleType.HITL
    ) {
      toast.error(
        "Solo se puede cambiar entre roles de Usuario y Agente Humano",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    setSelectedUser(user);
    setModalChangeRole(true);
  };

  const handleConfirmChangeRole = async (newRole: OrganizationRoleType) => {
    if (!selectedUser || !selectOrganizationId) {
      toast.error("Error en la selección de usuario u organización", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await changeUserRole(
        selectOrganizationId,
        selectedUser.id,
        newRole
      );
      if (result.success) {
        toast.success(result.message || "Rol actualizado correctamente", {
          position: "top-right",
          autoClose: 3000,
        });
        await getAllUsers(); // Refrescar la lista
      }
    } catch (error) {
      toast.error("Error al cambiar el rol del usuario", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <Modal isShown={modalAddUser} onClose={() => setModalAddUser(false)}>
        <ModalAddUser
          close={setModalAddUser}
          getAllUsers={getAllUsers}
          users={users}
        />
      </Modal>

      <Modal isShown={modalEditUser} onClose={() => setModalEditUser(false)}>
        <ModalAddUser
          close={setModalEditUser}
          getAllUsers={getAllUsers}
          editUser={selectedUser}
          users={users}
        />
      </Modal>

      <Modal
        isShown={modalChangeRole}
        onClose={() => setModalChangeRole(false)}
      >
        <div>
          {selectedUser && (
            <ModalChangeRole
              close={() => setModalChangeRole(false)}
              handleChangeRole={handleConfirmChangeRole}
              currentRole={selectedUser.userOrganizations[0]?.role}
              userEmail={selectedUser.email}
            />
          )}
        </div>
      </Modal>

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        {role === OrganizationRoleType.OWNER && (
          <button
            type="button"
            onClick={() => setModalAddUser(true)}
            className="flex justify-center items-center gap-2 w-[170px] h-[40px] text-white rounded-[4px] leading-[24px] bg-[#001130] hover:bg-opacity-90"
          >
            + Crear usuario
          </button>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[20px] 2xl:gap-[24px]">
            {users.map(user => {
              return (
                <UserCard
                  key={user.id}
                  userData={user}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => handleDelete(user)}
                  onChangeRole={() => handleChangeRole(user)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default UsersOrganization;
