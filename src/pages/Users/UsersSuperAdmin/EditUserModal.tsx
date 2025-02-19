import { Fragment, useEffect, useState } from "react";
import Modal from "@components/Modal";
import { updateGlobalUser, getGlobalUser, deleteRole } from "@services/user";
import { OrganizationRoleType } from "@utils/interfaces";
import { toast } from "react-toastify";
import { InputGroup } from "@components/forms/inputGroup";
import CreateUserModal from "./CreateUserModal"; // Importamos el modal existente
import { FiTrash } from "react-icons/fi"; // Ícono para eliminar
import { Input } from "@components/forms/input";
import { Button } from "@components/common/Button";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}

interface RoleData {
  id?: number; // ID opcional en caso de que exista
  role: OrganizationRoleType;
  organization: { id: number; name: string } | null;
}

const EditUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: EditUserModalProps) => {
  const [userRoles, setUserRoles] = useState<RoleData[]>([]);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [email, setEmail] = useState("");

  const refreshUserRoles = async () => {
    const user = await getGlobalUser(userId);
    if (user) {
      setEmail(user.email || "");
      const roles = user.userOrganizations.map(org => ({
        id: org.id,
        role: org.role as OrganizationRoleType,
        organization: {
          id: org.organization?.id,
          name: org.organization?.name,
        },
      }));
      setUserRoles(roles);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshUserRoles();
    }
  }, [isOpen, userId]);

  const handleDeleteRole = async (roleId?: number) => {
    if (!roleId) return;
    await deleteRole(roleId);
    refreshUserRoles();
  };

  const handleSave = async () => {
    const success = await updateGlobalUser(userId, email);

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
      <Fragment>
        <div className="space-y-4">
          <InputGroup label="Email">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </InputGroup>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Roles</h3>
            <button
              type="button"
              onClick={() => setIsAddingRole(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Agregar Rol
            </button>
          </div>
          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2">Rol</th>
                <th className="border border-gray-200 px-4 py-2">
                  Organización
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((role, index) => (
                <tr key={index}>
                  <td className="border border-gray-200 px-4 py-2">
                    {role.role}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {role.organization?.name || "Global"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={handleSave} variant="primary">
              Guardar Cambios
            </Button>
          </div>
        </div>

        {isAddingRole && (
          <CreateUserModal
            isOpen={isAddingRole}
            onClose={() => setIsAddingRole(false)}
            onSuccess={() => {
              setIsAddingRole(false);
              refreshUserRoles();
            }}
            email={email}
          />
        )}
      </Fragment>
    </Modal>
  );
};

export default EditUserModal;
