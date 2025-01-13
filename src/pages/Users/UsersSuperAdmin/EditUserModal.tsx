import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@components/Modal";
import { updateGlobalUser, getGlobalUser } from "@services/user";
import { OrganizationRoleType } from "@utils/interfaces";
import { toast } from "react-toastify";
import { Select } from "@components/forms/select";
import { InputGroup } from "@components/forms/inputGroup";
import { Control } from "react-hook-form";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  control: Control<FormData>;
}

interface FormData {
  email: string;
  role: OrganizationRoleType;
}

const EditUserModal = ({
  control,
  isOpen,
  onClose,
  onSuccess,
  userId,
}: EditUserModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getGlobalUser(userId);
      if (user) {
        reset({ email: user.email, role: user.role });
      }
    };
    if (isOpen) {
      fetchUser();
    }
  }, [isOpen, userId, reset]);

  const onSubmit = async (data: FormData) => {
    const success = await updateGlobalUser(userId, data.email, data.role);
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
