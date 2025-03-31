import Loading from "@components/Loading";
import Modal from "@components/Modal";
import { getOrganizations, deleteOrganization } from "@services/organizations";
import { useEffect, useState, useMemo } from "react";
import OrganizationCard from "./OrganizationCard";
import ModalCreateOrganization from "./ModalCreateUser";
import { useForm } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import { IUserApi } from "../Users/UsersOrganization";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
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
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-2.5 px-6 text-left font-size-[16px] text-sofia-superDark font-normal">
                  Organización
                </th>
                <th className="py-2.5 px-6 text-left font-size-[16px] text-sofia-superDark font-normal">
                  ID
                </th>
                <th className="py-2.5 px-6 text-left font-size-[16px] text-sofia-superDark font-normal">
                  Descripción
                </th>
                <th className="py-2.5 px-6 text-left font-size-[16px] text-sofia-superDark font-normal">
                  Email
                </th>
                <th className="py-2.5 px-6 text-left font-size-[16px] text-sofia-superDark font-normal">
                  Departamentos
                </th>
                <th className="py-2.5 px-6 text-center font-size-[16px] text-sofia-superDark font-normal">
                  Usuarios
                </th>
                <th className="py-2.5 px-6 text-right font-size-[16px] text-sofia-superDark font-normal">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="relative before:content-[''] before:absolute before:-z-10 before:inset-0 before:rounded-[8px] before:border-[2px] before:border-[#DBEAF2] before:border-inherit">
              {organizations.map(organization => (
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
      </div>
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

const ITEMS_PER_PAGE = 10;

const Organizations = () => {
  const { organizations, loading, getAllOrganizations } = useOrganizations();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
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

  const filteredOrganizations = useMemo(() => {
    if (!searchTerm.trim()) return organizations;

    return organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.id.toString().includes(searchTerm)
    );
  }, [organizations, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredOrganizations.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages === 0 ? 1 : newTotalPages);
    }
  }, [filteredOrganizations, currentPage]);

  const totalPages = Math.ceil(filteredOrganizations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrganizations = filteredOrganizations.slice(startIndex, endIndex);

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
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setSelectedOrg(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 px-4 w-[190px] h-[41px] text-white rounded-lg leading-[24px] bg-[#001130] hover:bg-opacity-90"
          >
            <FiPlus /> Crear organización
          </button>

          <div className="flex items-center">
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 lg:hidden"
              >
                <FiSearch className="w-5 h-5 text-gray-500" />
              </button>
            )}
            
            <div className={`relative ${isSearchOpen ? 'flex' : 'hidden'} lg:flex`}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src="/mvp/magnifying-glass.svg" alt="Buscar" className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px] py-2 pl-10 pr-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-[#001130] focus:border-[#001130]"
                placeholder="Buscar organización..."
              />
              <button
                onClick={() => {
                  if (searchTerm) {
                    setSearchTerm("");
                  } else if (isSearchOpen) {
                    setIsSearchOpen(false);
                  }
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {filteredOrganizations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron organizaciones que coincidan con tu búsqueda.
              </div>
            ) : (
              <>
                <OrganizationList
                  organizations={currentOrganizations}
                  onEdit={organization => {
                    setSelectedOrg(organization);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />

                {totalPages > 1 && (
                  <div className="flex justify-center items-center py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <img src="/mvp/chevron-left.svg" alt="Anterior" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <img src="/mvp/chevron-right.svg" alt="Siguiente" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Organizations;
