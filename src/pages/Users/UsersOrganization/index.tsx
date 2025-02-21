import Loading from "@components/Loading";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { getUserMyOrganization } from "../../../services/user";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { OrganizationRoleType } from "@utils/interfaces";
import Modal from "@components/Modal";
import ModalAddUser from "./ModalAddUser";
import { toast } from "react-toastify";

export interface IUserApi {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  email_verified: boolean;
  last_login: string | null;
  userOrganizations: [
    {
      role: OrganizationRoleType;
      organization: null;
    },
  ];
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

  const handleDelete = () => {
    toast.error("Esta función no está disponible en este momento", {
      position: "top-right",
      autoClose: 3000
    });
  };

  const handleEdit = (user: IUserApi) => {
    setSelectedUser(user);
    setModalEditUser(true);
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

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        {role === OrganizationRoleType.OWNER && (
          <button
            type="button"
            onClick={() => setModalAddUser(true)}
            className="flex justify-center items-center gap-2 w-[170px] h-[40px] text-white rounded-lg leading-[24px] bg-[#001130] hover:bg-opacity-90"
          >
            + Agregar usuario
          </button>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[20px] 2xl:gap-[24px]">
            {users.map(user => {
              return <UserCard 
                key={user.id} 
                userData={user} 
                onEdit={() => handleEdit(user)} 
                onDelete={handleDelete} 
              />;
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default UsersOrganization;
