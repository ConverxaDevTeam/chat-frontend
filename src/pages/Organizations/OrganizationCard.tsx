import { useRoleAuth } from "@hooks/useRoleAuth";
import { IOrganization, AgentType } from "@interfaces/organization.interface";
import { getInitials } from "@utils/format";
import { InlineInputGroup } from "@components/forms/inlineInputGroup";
import { useState, useEffect, useRef } from "react";
import { updateOrganizationAgentType } from "@services/organizations";
import Modal from "@components/Modal";
import ChangePasswordModal from "./ChangePasswordModal";
import ContextMenu from "@components/ContextMenu";

interface OrganizationCardProps {
  organization: IOrganization;
  onEdit: () => void;
  onDelete: () => void;
  onSetCustomPlan: () => void;
}

const OrganizationCard = ({
  organization,
  onEdit,
  onDelete,
  onSetCustomPlan,
}: OrganizationCardProps) => {
  const { isSuperAdmin } = useRoleAuth();
  const hasDeletePermission = isSuperAdmin;
  const [agentType, setAgentType] = useState<AgentType>(
    organization.agentType || AgentType.SOFIA_ASISTENTE
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleAgentTypeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newAgentType = e.target.value as AgentType;
    setAgentType(newAgentType);
    await updateOrganizationAgentType(organization.id, newAgentType);
  };

  useEffect(() => {
    setAgentType(organization.agentType || AgentType.SOFIA_ASISTENTE);
  }, [organization.agentType]);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({
        x: rect.right,
        y: rect.top,
      });
      setShowContextMenu(true);
    }
  };

  const handleCloseMenu = () => {
    setShowContextMenu(false);
  };

  return (
    <>
      <Modal
        isShown={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      >
        <ChangePasswordModal
          organizationId={organization.id}
          close={setShowPasswordModal}
        />
      </Modal>

      {showContextMenu && (
        <ContextMenu position={menuPosition} onClose={handleCloseMenu}>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 w-full text-left"
          >
            <img src="/mvp/pencil.svg" alt="Editar" className="w-4 h-4" />
            <span>Editar</span>
          </button>

          {hasDeletePermission && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 w-full text-left"
            >
              <img src="/mvp/trash.svg" alt="Eliminar" className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 w-full text-left"
            >
              <img
                src="/mvp/lock.svg"
                alt="Cambiar contraseña"
                className="w-4 h-4"
              />
              <span>Cambiar contraseña</span>
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => {
                onSetCustomPlan();
                handleCloseMenu();
              }}
              className="flex items-center gap-2 w-full text-left"
            >
              <img
                src="/mvp/sliders-vertical.svg"
                alt="Cambiar tipo de organización"
                className="w-4 h-4"
              />
              <span>Cambiar tipo de organización</span>
            </button>
          )}
        </ContextMenu>
      )}

      <tr className="h-[60px] border-b-[1px] border-app-lightGray hover:bg-gray-50">
        <td className="py-2.5 px-6">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-8 h-8 rounded-[4px] before:content-[''] before:absolute before:-z-10 before:inset-0 before:bg-custom-gradient before:rounded-[8px] before:border-[2px] before:border-[#B8CCE0] before:border-inherit before:bg-app-c2 overflow-hidden flex-shrink-0">
              {organization.logo ? (
                <img
                  src={organization.logo}
                  alt={`${organization.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-600 font-medium text-sm">
                  {getInitials(organization.name)}
                </p>
              )}
            </div>
            <span className="font-medium text-gray-900 capitalize">
              {organization.name}
            </span>
          </div>
        </td>
        <td className="py-2.5 px-6 text-sm font-medium">{organization.id}</td>
        <td className="py-2.5 px-6">
          <p
            className="text-sm font-medium text-gray-600 truncate max-w-[200px]"
            title={organization.description}
          >
            {organization.description}
          </p>
        </td>
        <td className="py-2.5 px-6">
          <p
            className="text-sm font-medium text-gray-600 truncate max-w-[200px]"
            title={organization.email || organization.owner?.user.email || ""}
          >
            {organization.email || organization.owner?.user.email || "-"}
          </p>
        </td>
        <td className="py-2.5 px-6">
          <p
            className="text-sm font-medium text-gray-600 truncate max-w-[200px] capitalize"
            title={organization.type}
          >
            {organization.type || "-"}
          </p>
        </td>
        <td className="py-2.5 px-6">
          <p
            className="text-sm font-medium text-gray-600 truncate max-w-[200px]"
            title={
              organization.departments !== undefined
                ? organization.departments.toString()
                : ""
            }
          >
            {organization.departments !== undefined
              ? organization.departments
              : "-"}
          </p>
        </td>
        <td className="py-2.5 px-6 text-center font-size-[16px]">
          <span className="text-sm font-medium text-gray-600 px-3 py-0.5 rounded-[4px]">
            {organization.users}
          </span>
        </td>
        <td className="py-2.5 px-6 first:rounded-tr-[8px] last:rounded-br-[8px]">
          <div className="flex justify-end">
            <button
              ref={menuButtonRef}
              onClick={handleOpenMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <img
                src="/mvp/three-dots.svg"
                alt="Opciones"
                className="w-5 h-5"
              />
            </button>
          </div>
        </td>
        <td className="py-2.5 px-6">
          {isSuperAdmin && (
            <div className="flex items-center">
              <InlineInputGroup label="Agente:">
                <select
                  className="w-full p-2 border rounded-[4px] focus:outline-none text-[14px] bg-white"
                  value={agentType}
                  onChange={handleAgentTypeChange}
                >
                  <option value={AgentType.SOFIA_ASISTENTE}>Sofia</option>
                  <option value={AgentType.CLAUDE}>Claude</option>
                </select>
              </InlineInputGroup>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default OrganizationCard;
