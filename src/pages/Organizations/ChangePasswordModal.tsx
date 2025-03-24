import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { changeUserPassword, getUserMyOrganization } from "@services/user";
import { IUserApi } from "../Users/UsersOrganization";
import { OrganizationRoleType } from "@utils/interfaces";
import { Input } from "@components/forms/input";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";
import { InputGroup } from "@components/forms/inputGroup";

interface ChangePasswordModalProps {
  organizationId: number;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = {
  userId: number;
  newPassword: string;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  organizationId,
  close,
}) => {
  const [users, setUsers] = useState<IUserApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserMyOrganization(organizationId);
        if (response) {
          setUsers(response);
        } else {
          // Usuarios dummy en caso de que falle la API
          setUsers([
            {
              id: 1,
              email: "usuario1@example.com",
              first_name: "Usuario",
              last_name: "Uno",
              email_verified: false,
              last_login: null,
              userOrganizations: [
                { role: OrganizationRoleType.OWNER, organization: null },
              ],
            },
            {
              id: 2,
              email: "usuario2@example.com",
              first_name: "Usuario",
              last_name: "Dos",
              email_verified: false,
              last_login: null,
              userOrganizations: [
                { role: OrganizationRoleType.ADMIN, organization: null },
              ],
            },
            {
              id: 3,
              email: "usuario3@example.com",
              first_name: "Usuario",
              last_name: "Tres",
              email_verified: false,
              last_login: null,
              userOrganizations: [
                { role: OrganizationRoleType.USER, organization: null },
              ],
            },
          ]);
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [organizationId]);

  const onSubmit = async (data: FormData) => {
    if (!data.userId) {
      toast.error("Debes seleccionar un usuario", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!data.newPassword || data.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const success = await changeUserPassword(data.userId, data.newPassword);
      if (success) {
        toast.success("Contraseña cambiada con éxito", {
          position: "top-right",
          autoClose: 3000,
        });
        reset();
        close(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(user => ({
    value: user.id.toString(),
    label: `${user.email} - ${user.first_name} ${user.last_name}`,
  }));

  return (
    <div className="w-[400px] max-w-full">
      <h2 className="text-xl font-bold mb-4">Cambiar Contraseña de Usuario</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {loadingUsers ? (
            <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <InputGroup label="Seleccionar Usuario" errors={errors.userId}>
              <Select
                name="userId"
                control={control}
                options={userOptions}
                rules={{ required: "Este campo es obligatorio" }}
              />
            </InputGroup>
          )}
        </div>
        <div>
          <InputGroup label="Nueva Contraseña" errors={errors.newPassword}>
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "Este campo es obligatorio",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              }}
              render={({ field }) => (
                <Input
                  type="password"
                  placeholder="Nueva Contraseña"
                  {...field}
                  className="w-full"
                />
              )}
            />
          </InputGroup>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => close(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
            disabled={loading}
          >
            Cancelar
          </button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
