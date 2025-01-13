import { useState, useEffect } from "react";
import { OrganizationRoleType } from "@utils/interfaces";
import Modal from "@components/Modal";
import Select from "@components/Select";

interface SelectRoleOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    role: OrganizationRoleType,
    organization: number | null,
    name: string
  ) => void;
  editIndex: number | null;
  currentData: {
    role: OrganizationRoleType;
    organization: number | null;
    name: string;
  } | null;
}

export const SelectRoleOrgModal = ({
  isOpen,
  onClose,
  onSubmit,
  editIndex,
  currentData,
}: SelectRoleOrgModalProps) => {
  const [role, setRole] = useState<OrganizationRoleType | null>(null);
  const [organization, setOrganization] = useState<number | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (isOpen && currentData) {
      setRole(currentData.role);
      setOrganization(currentData.organization);
      setName(currentData.name);
    }
  }, [isOpen, currentData]);

  const handleSave = () => {
    if (role !== null && name.trim() !== "") {
      onSubmit(role, organization, name);
    }
  };

  return isOpen ? (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        editIndex !== null ? (
          <div>"Editar Rol y Organización"</div>
        ) : (
          <div>"Agregar Rol y Organización"</div>
        )
      }
    >
      <div>
        {/* Selector de rol */}
        <Select
          options={[
            { id: OrganizationRoleType.ING_PREVENTA, name: "Preventa" },
            { id: OrganizationRoleType.USR_TECNICO, name: "Técnico" },
          ]}
          value={role ? { id: role, name: role } : null}
          onChange={selectedOption =>
            setRole((selectedOption as OrganizationRoleType) || null)
          }
          placeholder="Selecciona un rol"
        />

        {/* Selector de organización */}
        <Select
          options={[
            { id: null, name: "Global" },
            { id: 1, name: "Organización 1" },
            { id: 2, name: "Organización 2" },
          ]}
          value={
            organization
              ? { id: organization, name: `Organización ${organization}` }
              : null
          }
          onChange={selectedOption =>
            setOrganization((selectedOption as number) || null)
          }
          placeholder="Selecciona una organización"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  ) : null;
};
