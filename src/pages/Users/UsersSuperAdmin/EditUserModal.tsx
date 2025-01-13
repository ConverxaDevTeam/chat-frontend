import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Modal from "@components/Modal";
import { updateGlobalUser, getGlobalUser } from "@services/user";
import { OrganizationRoleType } from "@utils/interfaces";
import { toast } from "react-toastify";
import SelectMultiple from "@components/forms/selectMultiple";
import { InputGroup } from "@components/forms/inputGroup";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}

interface FormData {
  email: string;
  roles: OrganizationRoleType[]; // Aceptamos múltiples roles
  organizations: (number | null)[]; // Aceptamos múltiples organizaciones
}

const EditUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: EditUserModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Ref para acceder al contenedor del modal
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getGlobalUser(userId);
      if (user) {
        // Verificar que los datos están disponibles antes de resetear
        const initialData = {
          email: user.email,
          roles: user.userOrganizations.map(
            org => org.role as OrganizationRoleType
          ), // Asignamos todos los roles
          organizations: user.userOrganizations.map(
            org => org.organization?.id ?? null
          ), // Asignamos las organizaciones
        };
        reset(initialData);
      }
    };

    // Solo llamar a fetchUser si el modal está abierto
    if (isOpen) {
      fetchUser();
    }
  }, [isOpen, userId, reset]); // Este useEffect solo se ejecutará cuando `isOpen` o `userId` cambien

  const onSubmit = async (data: FormData) => {
    const success = await updateGlobalUser(
      userId,
      data.email,
      data.roles,
      data.organizations
    );
    if (success) {
      toast.success("Usuario actualizado exitosamente");
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={<h2 className="text-xl font-bold">Editar Usuario</h2>}
      modalRef={modalRef} // Pasamos el ref para utilizarlo en los SelectMultiple
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup label="Email" errors={errors.email}>
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
        </InputGroup>

        <InputGroup label="Roles" errors={errors.roles}>
          <SelectMultiple
            name="roles"
            control={control}
            options={[
              { value: OrganizationRoleType.ING_PREVENTA, label: "Preventa" },
              { value: OrganizationRoleType.USR_TECNICO, label: "Técnico" },
              // Agrega más roles según sea necesario
            ]}
            placeholder="Selecciona uno o más roles"
            modalRef={modalRef} // Aseguramos que SelectMultiple tiene el modalRef
          />
          {errors.roles && (
            <p className="mt-1 text-sm text-red-600">El rol es requerido</p>
          )}
        </InputGroup>

        <InputGroup label="Organizaciones" errors={errors.organizations}>
          <SelectMultiple
            name="organizations"
            control={control}
            options={[
              { value: null, label: "Global" }, // Opción global
              // Agregar dinámicamente las organizaciones del usuario si las tiene
              { value: "org1", label: "Organización 1" },
              { value: "org2", label: "Organización 2" },
              // Agrega más organizaciones según sea necesario
            ]}
            placeholder="Selecciona una o más organizaciones"
            modalRef={modalRef} // Aseguramos que SelectMultiple tiene el modalRef
          />
          {errors.organizations && (
            <p className="mt-1 text-sm text-red-600">
              La organización es requerida
            </p>
          )}
        </InputGroup>

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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Actualizar Usuario
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
