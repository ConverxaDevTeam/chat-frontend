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
import ButtonExportAllOrganizations from "./ButtonExportAllOrganizations";
import ChangeOrganizationTypeModal from "./ChangeOrganizationTypeModal";
import TablePagination from "../Users/UsersSuperAdmin/components/TablePagination";

type EditFormData = {
  owner_id: number;
};

interface OrganizationListProps {
  organizations: IOrganization[];
  onEdit: (organization: IOrganization) => void;
  onDelete: (organization: IOrganization) => void;
  onSetCustomPlan: (organization: IOrganization) => void;
}

const OrganizationList = ({
  organizations,
  onEdit,
  onDelete,
  onSetCustomPlan,
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
                  Tipo
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
            <tbody className="relative bg-white rounded border border-app-lightGray">
              {organizations.map(organization => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                  onEdit={() => onEdit(organization)}
                  onDelete={() => onDelete(organization)}
                  onSetCustomPlan={() => onSetCustomPlan(organization)}
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
      selectedOrg.owner.user &&
      !users.find(u => u.id === selectedOrg.owner?.user.id)
    ) {
      options.unshift(
        <option key="current-owner" value={selectedOrg.owner.user?.id} disabled>
          {selectedOrg.owner.user?.email}
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

// Eliminamos la constante ITEMS_PER_PAGE ya que ahora será un estado

const Organizations = () => {
  const { organizations, loading, getAllOrganizations } = useOrganizations();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { users, getUsers } = useUsers();
  const { isModalOpen, setIsModalOpen } = useModals();
  const [isCustomPlanModalOpen, setIsCustomPlanModalOpen] =
    useState<boolean>(false);
  const [selectedPlanOrg, setSelectedPlanOrg] = useState<IOrganization | null>(
    null
  );
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

    return organizations.filter(
      org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.id.toString().includes(searchTerm)
    );
  }, [organizations, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const newTotalPages = Math.ceil(
      filteredOrganizations.length / itemsPerPage
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages === 0 ? 1 : newTotalPages);
    }
  }, [filteredOrganizations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(
    startIndex,
    endIndex
  );

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Función para cambiar el número de elementos por página
  const handleChangeItemsPerPage = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Resetear a la primera página cuando cambia el número de items
  };

  const handleSetCustomPlan = (organization: IOrganization) => {
    setSelectedPlanOrg(organization);
    setIsCustomPlanModalOpen(true);
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

      {isCustomPlanModalOpen && selectedPlanOrg && (
        <Modal
          isShown={isCustomPlanModalOpen}
          onClose={() => {
            setIsCustomPlanModalOpen(false);
            setSelectedPlanOrg(null);
          }}
        >
          <ChangeOrganizationTypeModal
            organization={selectedPlanOrg}
            onClose={() => {
              setIsCustomPlanModalOpen(false);
              setSelectedPlanOrg(null);
            }}
            onPlanUpdated={getAllOrganizations}
          />
        </Modal>
      )}

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setSelectedOrg(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 px-4 w-[190px] h-[41px] text-white rounded leading-[24px] bg-[#001130] hover:bg-opacity-90"
          >
            <FiPlus /> Crear organización
          </button>

          <div className="flex items-center gap-2">
            <ButtonExportAllOrganizations
              organizations={filteredOrganizations}
            />
            {!isSearchOpen && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 lg:hidden"
              >
                <FiSearch className="w-5 h-5 text-gray-500" />
              </button>
            )}

            <div
              className={`relative ${isSearchOpen ? "flex" : "hidden"} lg:flex`}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img
                  src="/mvp/magnifying-glass-gray.svg"
                  alt="Buscar"
                  className="w-5 h-5 text-gray-500"
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-[300px] py-2 pl-10 pr-4 text-sm bg-[#FCFCFC] border-[1px] border-[#DBEAF2] rounded-[4px] focus:ring-[#DBEAF2] focus:border-[#DBEAF4]"
                placeholder="Búsqueda"
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
                  onSetCustomPlan={handleSetCustomPlan}
                />

                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                  totalItems={filteredOrganizations.length}
                  itemsPerPage={itemsPerPage}
                  onChangeItemsPerPage={handleChangeItemsPerPage}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Organizations;
