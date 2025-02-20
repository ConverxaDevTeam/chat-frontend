import Loading from "@components/Loading";
import Modal from "@components/Modal";
import { getOrganizations, deleteOrganization } from "@services/organizations";
import { useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import ModalCreateOrganization from "./ModalCreateUser";
import { useForm } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import { IUserApi } from "../Users/UsersOrganization";
import { FiPlus } from "react-icons/fi";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { IOrganization } from "@interfaces/organization.interface";

type EditFormData = {
  owner_id: number;
};

interface OrganizationListProps {
  organizations: IOrganization[];
  onEdit: (organization: IOrganization) => void;
  onDelete: (organization: IOrganization) => void;
}

const OrganizationList = ({
  organizations,
  onEdit,
  onDelete,
}: OrganizationListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[20px] 2xl:gap-[24px]">
    {organizations.map(organization => (
      <OrganizationCard
        key={organization.id}
        organization={organization}
        onEdit={() => onEdit(organization)}
        onDelete={() => onDelete(organization)}
      />
    ))}
  </div>
);

interface CreateModalProps {
  isShown: boolean;
  onClose: () => void;
  getAllOrganizations: () => Promise<void>;
  organization?: IOrganization | null;
  updateOrganization: (org: IOrganization) => void;
}

const CreateModal = ({
  isShown,
  onClose,
  getAllOrganizations,
  organization,
}: CreateModalProps) => (
  <Modal
    isShown={isShown}
    onClose={onClose}
    children={
      <ModalCreateOrganization
        getAllOrganizations={getAllOrganizations}
        close={onClose}
        organization={organization}
      />
    }
  />
);

const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllOrganizations = async () => {
    try {
      const response = await getOrganizations();
      if (response) {
        setOrganizations(prev => {
          // Si no hay cambios, mantener el estado anterior
          if (JSON.stringify(prev) === JSON.stringify(response)) {
            return prev;
          }
          return response;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return { organizations, loading, getAllOrganizations, setOrganizations };
};

const useUsers = () => {
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const getUsers = async (organizationId: number) => {
    setLoadingUsers(true);
    try {
      const response = await getUserMyOrganization(organizationId);
      if (response) {
        setUsers(response);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  return { users, loadingUsers, getUsers };
};

const useModals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen,
  };
};

const useHandles = (
  users: IUserApi[],
  getAllOrganizations: () => Promise<void>
) => {
  const { handleOperation, showConfirmation } = useAlertContext();
  const { register, handleSubmit, reset } = useForm<EditFormData>();
  const [selectedOrg, setSelectedOrg] = useState<IOrganization | null>(null);

  const handleDelete = async (organization: IOrganization) => {
    const confirmed = await showConfirmation({
      title: "¿Eliminar organización?",
      text: "Esta acción no se puede deshacer",
    });
    if (confirmed) {
      const result = await handleOperation(
        async () => deleteOrganization(organization.id),
        {
          title: "Eliminando Organización",
          successTitle: "¡Éxito!",
          successText: "Organización eliminada correctamente",
          errorTitle: "Error al eliminar",
        }
      );

      if (result.success) {
        getAllOrganizations();
      }
    }
  };

  const updateOrganization = (updatedOrg: IOrganization) => {
    console.log(updatedOrg);
    getAllOrganizations();
  };

  const getUserOptions = () => {
    const options = users.map(user => (
      <option key={user.id} value={user.id}>
        {user.email} - {user.first_name} {user.last_name}
      </option>
    ));

    if (
      selectedOrg?.owner &&
      !users.find(u => u.id === selectedOrg.owner?.user.id)
    ) {
      options.unshift(
        <option key="current-owner" value={selectedOrg.owner.user.id} disabled>
          {selectedOrg.owner.user.email}
        </option>
      );
    }

    return options;
  };

  return {
    handleDelete,
    getUserOptions,
    register,
    handleSubmit,
    reset,
    selectedOrg,
    setSelectedOrg,
    updateOrganization,
  };
};

const Organizations = () => {
  const { organizations, loading, getAllOrganizations } = useOrganizations();
  const { users, getUsers } = useUsers();
  const { isModalOpen, setIsModalOpen } = useModals();
  const {
    handleDelete,
    reset,
    selectedOrg,
    setSelectedOrg,
    updateOrganization,
  } = useHandles(users, getAllOrganizations);

  useEffect(() => {
    getAllOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg && isModalOpen) {
      getUsers(selectedOrg.id);
      reset({ owner_id: selectedOrg.owner?.user.id || 0 });
    }
  }, [selectedOrg, isModalOpen, reset]);

  return (
    <>
      <CreateModal
        isShown={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrg(null);
        }}
        getAllOrganizations={getAllOrganizations}
        organization={selectedOrg}
        updateOrganization={updateOrganization}
      />

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        <button
          type="button"
          onClick={() => {
            setSelectedOrg(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 px-4 w-[190px] h-[40px] text-white rounded-lg leading-[24px] bg-[#001130] hover:bg-opacity-90"
        >
          <FiPlus /> Crear organización
        </button>
        {loading ? (
          <Loading />
        ) : (
          <OrganizationList
            organizations={organizations}
            onEdit={organization => {
              setSelectedOrg(organization);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default Organizations;
