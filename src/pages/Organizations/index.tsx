import Loading from "@components/Loading";
import Modal from "@components/Modal";
import { getOrganizations, deleteOrganization } from "@services/organizations";
import { useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import ModalCreateOrganization from "./ModalCreateUser";
import { useForm } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import { IUserApi } from "../Users/UsersOrganization";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
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
}: OrganizationListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(organizations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrganizations = organizations.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto w-full rounded-[4px] border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organización
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuarios
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrganizations.map(organization => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                onEdit={() => onEdit(organization)}
                onDelete={() => onDelete(organization)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center py-3 px-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">
                {startIndex + 1} - {Math.min(endIndex, organizations.length)}
              </span>{" "}
              de <span className="font-medium">{organizations.length}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/mvp/chevron-left.svg" alt="Anterior" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/mvp/chevron-right.svg" alt="Siguiente" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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

const ITEMS_PER_PAGE = 8;

const Organizations = () => {
  const { organizations, loading, getAllOrganizations } = useOrganizations();
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  useEffect(() => {
    const newTotalPages = Math.ceil(organizations.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages === 0 ? 1 : newTotalPages);
    }
  }, [organizations, currentPage]);

  const totalPages = Math.ceil(organizations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrganizations = organizations.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
            organizations={currentOrganizations}
            onEdit={organization => {
              setSelectedOrg(organization);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            pageNum => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 border rounded ${
                  pageNum === currentPage ? "bg-gray-300" : ""
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default Organizations;
