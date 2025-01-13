import { useEffect, useState } from "react";
import { useForm, FieldErrors, Control } from "react-hook-form";
import Modal from "@components/Modal";
import { createGlobalUser } from "@services/user";
import { getOrganizations } from "@services/organizations";
import { toast } from "react-toastify";
import { OrganizationRoleType } from "@utils/interfaces";
import { Select } from "@components/forms/select";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { ISelectOrganization } from "@interfaces/organization.interface";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email?: string;
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
  email,
}: CreateUserModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      role: OrganizationRoleType.ING_PREVENTA,
      email: email || "",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    console.log("Formulario enviado con datos:", data);
    const success = await createGlobalUser(
      data.email,
      role,
      role === OrganizationRoleType.USR_TECNICO
        ? data.organizationId
        : undefined
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
        <InputGroup label="Email" errors={errors.email}>
          <Input
            type="email"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            disabled={isSubmitting || !!email}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </InputGroup>
        <InputGroup label="Rol" errors={errors.role}>
          <Select
            name="role"
            control={control}
            options={[
              { value: OrganizationRoleType.ING_PREVENTA, label: "Preventa" },
              { value: OrganizationRoleType.USR_TECNICO, label: "Técnico" },
            ]}
            placeholder="Selecciona un rol"
          />
        </InputGroup>
        {role === OrganizationRoleType.USR_TECNICO && (
          <OrganizationSelect
            errors={errors}
            isRequired={true}
            control={control}
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
            {isSubmitting
              ? "Creando..."
              : email
                ? "Actualizar Usuario"
                : "Crear Usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface OrganizationSelectProps {
  errors: FieldErrors<FormData>;
  isRequired: boolean;
  control: Control<FormData>;
}

const OrganizationSelect = ({
  errors,
  isRequired,
  control,
}: OrganizationSelectProps) => {
  const [organizations, setOrganizations] = useState<ISelectOrganization[]>([]);

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
    <InputGroup label="Organización" errors={errors.organizationId}>
      <Select
        name="organizationId"
        control={control}
        rules={{
          required: isRequired ? "La organización es requerida" : false,
        }}
        placeholder="Selecciona una organización"
        options={organizations.map(org => ({
          value: org.id.toString(),
          label: org.name,
        }))}
      />
    </InputGroup>
  );
};

export default CreateUserModal;
