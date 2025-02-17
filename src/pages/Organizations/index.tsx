import Loading from "@components/Loading";
import Modal from "@components/Modal";
import {
  getOrganizations,
  deleteOrganization,
  editOrganization,
} from "@services/organizations";
import { useEffect, useState } from "react";
import OrganizationCard from "./OrganizationCard";
import ModalCreateOrganization from "./ModalCreateUser";
import { useForm } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import { IUserApi } from "../Users/UsersOrganization";
import { OrganizationRoleType } from "@utils/interfaces";
import { FiPlus } from "react-icons/fi";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

export type IOrganizarion = {
  id: number;
  logo?: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  users: number;
  owner?: {
    id: number;
    role: OrganizationRoleType;
    user: {
      id: number;
      email: string;
    };
  };
};

type EditFormData = {
  owner_id: number;
};

const Organizations = () => {
  const [organizations, setOrganizations] = useState<IOrganizarion[]>([]);
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<IOrganizarion | null>(null);
  const [isModalCreateOrganizationOpen, setIsModalCreateOrganizationOpen] =
    useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const { handleOperation, showConfirmation } = useAlertContext();
  const { register, handleSubmit, reset } = useForm<EditFormData>();

  const getAllOrganizations = async () => {
    try {
      const response = await getOrganizations();
      if (response) {
        setOrganizations(response);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = async (data: EditFormData) => {
    if (!selectedOrg) return;

    const result = await handleOperation(
      async () => {
        try {
          const success = await editOrganization(selectedOrg.id, data);
          if (!success) throw new Error("No se pudo editar la organización");
          return success;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Error inesperado al editar");
        }
      },
      {
        title: "Editando Owner",
        successTitle: "¡Éxito!",
        successText: "Owner actualizado correctamente",
        errorTitle: "Error al editar",
      }
    );

    if (result.success) {
      setIsModalEditOpen(false);
      getAllOrganizations();
    }
  };

  const handleDelete = async (organization: IOrganizarion) => {
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

  useEffect(() => {
    getAllOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg && isModalEditOpen) {
      getUsers(selectedOrg.id);
      reset({ owner_id: selectedOrg.owner?.user.id || 0 });
    }
  }, [selectedOrg, isModalEditOpen, reset]);

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

  return (
    <>
      <Modal
        isShown={isModalCreateOrganizationOpen}
        onClose={() => setIsModalCreateOrganizationOpen(false)}
        children={
          <ModalCreateOrganization
            getAllOrganizations={getAllOrganizations}
            close={() => setIsModalCreateOrganizationOpen(false)}
          />
        }
      />

      <Modal
        isShown={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        header={<h2 className="text-xl font-bold p-2">Editar Owner</h2>}
        footer={
          <div className="flex justify-center gap-2 p-[20px] w-[400px]">
            <button
              onClick={handleSubmit(handleEdit)}
              className="w-full px-4 py-3 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
            >
              Actualizar
            </button>
          </div>
        }
        children={
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={selectedOrg?.name}
                disabled
                className="w-full p-3 border text-gray-400 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Seleccionar owner
              </label>
              {loadingUsers ? (
                <Loading />
              ) : (
                <select
                  {...register("owner_id")}
                  className="w-full p-3 border text-gray-800 rounded-lg border-gray-300"
                >
                  <option value="">Seleccionar owner</option>
                  {getUserOptions()}
                </select>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={selectedOrg?.description}
                disabled
                className="w-full p-3 border text-gray-400 rounded-lg cursor-not-allowed"
              />
            </div>
          </form>
        }
      />

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        <button
          type="button"
          onClick={() => setIsModalCreateOrganizationOpen(true)}
          className="flex items-center gap-1 px-4 w-[190px] h-[40px] text-white rounded-lg leading-[24px] bg-app-dark hover:bg-opacity-90"
        >
          <FiPlus /> Crear organización
        </button>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[20px] 2xl:gap-[24px]">
            {organizations.map(organization => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                onEdit={() => {
                  setSelectedOrg(organization);
                  setIsModalEditOpen(true);
                }}
                onDelete={() => handleDelete(organization)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Organizations;
