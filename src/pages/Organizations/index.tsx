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
import { useSweetAlert } from "@hooks/useSweetAlert";
import { useForm } from "react-hook-form";
import { getUserMyOrganization } from "@services/user";
import { IUserApi } from "../Users/UsersOrganization";
import { OrganizationRoleType } from "@utils/interfaces";

export type IOrganizarion = {
  id: number;
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
  const { handleOperation, showConfirmation } = useSweetAlert();
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
        children={<p></p>}
        onClose={() => setIsModalCreateOrganizationOpen(false)}
        header={
          <ModalCreateOrganization
            getAllOrganizations={getAllOrganizations}
            close={() => setIsModalCreateOrganizationOpen(false)}
          />
        }
        footer={<button type="button">Crear</button>}
      />

      <Modal
        isShown={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        header={<h2 className="text-xl font-bold">Editar Owner</h2>}
        children={
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <p className="mt-1 text-gray-600">{selectedOrg?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <p className="mt-1 text-gray-600">{selectedOrg?.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Owner</label>
              {loadingUsers ? (
                <Loading />
              ) : (
                <select
                  {...register("owner_id")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Seleccionar owner</option>
                  {getUserOptions()}
                </select>
              )}
            </div>
          </form>
        }
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsModalEditOpen(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(handleEdit)}
              className="px-4 py-2 bg-app-dark text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full">
        <button
          type="button"
          onClick={() => setIsModalCreateOrganizationOpen(true)}
          className="w-[190px] h-[40px] border-[1px] rounded-full text-[16px] ml-auto leading-[24px] font-poppinsMedium bg-app-dark text-white"
        >
          Crear Organización
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
