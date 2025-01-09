import { useEffect, useState } from "react";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import Modal from "@components/Modal";
import { createGlobalUser } from "@services/user";
import { getOrganizations } from "@services/organizations";
import { toast } from "react-toastify";
import { OrganizationRoleType } from "@utils/interfaces";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  email: string;
  role: OrganizationRoleType;
  organizationId?: number;
}

const CreateUserModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      role: OrganizationRoleType.ING_PREVENTA,
    },
  });

  const role = watch("role");
  const isTecnicoRole = role === OrganizationRoleType.USR_TECNICO;

  const onSubmit = async (data: FormData) => {
    const success = await createGlobalUser(
      data.email,
      data.role,
      isTecnicoRole ? data.organizationId : undefined
    );
    if (success) {
      toast.success("Usuario creado exitosamente");
      reset();
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={<h2 className="text-xl font-bold">Nuevo Usuario</h2>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            {...register("role")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={OrganizationRoleType.ING_PREVENTA}>Preventa</option>
            <option value={OrganizationRoleType.USR_TECNICO}>Técnico</option>
          </select>
        </div>

        {isTecnicoRole && (
          <OrganizationSelect
            register={register}
            errors={errors}
            isRequired={true}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface OrganizationSelectProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isRequired: boolean;
}

interface IOrganization {
  id: number;
  name: string;
}

const OrganizationSelect = ({
  register,
  errors,
  isRequired,
}: OrganizationSelectProps) => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const response = await getOrganizations();
      if (response) {
        setOrganizations(response);
      }
    };
    fetchOrganizations();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Organización
      </label>
      <select
        {...register("organizationId", {
          required: isRequired ? "La organización es requerida" : false,
        })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Selecciona una organización</option>
        {organizations.map(org => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      {errors.organizationId && (
        <p className="mt-1 text-sm text-red-600">
          {errors.organizationId.message}
        </p>
      )}
    </div>
  );
};

export default CreateUserModal;
