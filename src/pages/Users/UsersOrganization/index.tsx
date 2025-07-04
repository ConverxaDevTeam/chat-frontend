import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import {
  getUserMyOrganization,
  deleteUserFromOrganization,
} from "../../../services/user";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { OrganizationRoleType } from "@utils/interfaces";
import Modal from "@components/Modal";
import ModalAddUser from "./ModalAddUser";
import ModalChangeRole from "./ModalChangeRole";
import ConfirmationModal from "@components/ConfirmationModal";
import { useUserRoleManagement } from "@hooks/useUserRoleManagement";
import { toast } from "react-toastify";
import PageContainer from "@components/PageContainer";

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

  const {
    isModalOpen: isRoleModalOpen,
    selectedUser: selectedRoleUser,
    handleInitiateRoleChange,
    handleConfirmRoleChange,
    handleCloseModal: handleCloseRoleModal,
  } = useUserRoleManagement({
    userRole: role!,
    organizationId: selectOrganizationId,
    onSuccess: getAllUsers,
  });

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

  const handleToggleHumanCommunication = (user: IUserApi) => {
    handleInitiateRoleChange(user);
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

      {selectedRoleUser && (
        <Modal isShown={false} onClose={handleCloseRoleModal}>
          <ModalChangeRole
            close={handleCloseRoleModal}
            handleChangeRole={handleConfirmRoleChange}
            currentRole={selectedRoleUser.userOrganizations[0]?.role}
            userEmail={selectedRoleUser.email}
          />
        </Modal>
      )}

      {selectedRoleUser && (
        <ConfirmationModal
          isShown={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          title="Cambiar comunicación humana"
          text={`¿Deseas ${selectedRoleUser.userOrganizations[0]?.role === OrganizationRoleType.USER ? 'activar' : 'desactivar'} la comunicación humana para ${selectedRoleUser.email}?`}
          onConfirm={() => handleConfirmRoleChange(
            selectedRoleUser.userOrganizations[0]?.role === OrganizationRoleType.USER 
              ? OrganizationRoleType.HITL 
              : OrganizationRoleType.USER
          )}
          confirmText={selectedRoleUser.userOrganizations[0]?.role === OrganizationRoleType.USER ? 'Activar' : 'Desactivar'}
          cancelText="Cancelar"
        />
      )}

      <PageContainer
        title="Usuarios"
        buttonText={role === OrganizationRoleType.OWNER ? "+ Crear usuario" : undefined}
        onButtonClick={role === OrganizationRoleType.OWNER ? () => setModalAddUser(true) : undefined}
        loading={loading}
      >
        <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-[16px] 2xl:gap-[16px]">
            {users.map(user => {
              return (
                <UserCard
                  key={user.id}
                  userData={user}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => handleDelete(user)}
                  humanCommunication={user.userOrganizations[0]?.role === OrganizationRoleType.HITL}
                  onToggleHumanCommunication={() => handleToggleHumanCommunication(user)}
                />
              );
            })}
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default UsersOrganization;
