import { useRoleAuth } from "@hooks/useRoleAuth";
import { IOrganization, AgentType } from "@interfaces/organization.interface";
import { getInitials } from "@utils/format";
import { InlineInputGroup } from "@components/forms/inlineInputGroup";
import { useState, useEffect } from "react";
import { updateOrganizationAgentType } from "@services/organizations";

interface OrganizationCardProps {
  organization: IOrganization;
  onEdit: () => void;
  onDelete: () => void;
}

const OrganizationCard = ({
  organization,
  onEdit,
  onDelete,
}: OrganizationCardProps) => {
  const { isSuperAdmin } = useRoleAuth();
  const hasDeletePermission = isSuperAdmin;
  const [agentType, setAgentType] = useState<AgentType>(
    organization.agentType || AgentType.SOFIA_ASISTENTE
  );

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

  return (
    <tr className="h-[60px] border-b-[1px] border-[#DBEAF2] hover:bg-gray-50">
      <td className="py-2.5 px-6">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center w-8 h-8 rounded-[4px] bg-gray-50 overflow-hidden flex-shrink-0">
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
          <span className="font-medium text-gray-900">{organization.name}</span>
        </div>
      </td>
      <td className="py-2.5 px-6 text-sm text-gray-600">{organization.id}</td>
      <td className="py-2.5 px-6">
        <p
          className="text-sm text-gray-600 truncate max-w-[200px]"
          title={organization.description}
        >
          {organization.description}
        </p>
      </td>
      <td className="py-2.5 px-6 text-center">
        <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-0.5 rounded-[4px]">
          {organization.users}
        </span>
      </td>
      <td className="py-2.5 px-6 first:rounded-tr-[8px] last:rounded-br-[8px]">
        <div className="flex justify-end gap-2">
          {hasDeletePermission && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-gray-500 bg-white border border-gray-200 rounded-[4px] font-size-[12px] font-medium hover:bg-gray-50 transition-all"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={onEdit}
            className="px-3 py-1 text-white bg-[#001130] rounded-[4px] font-size-[12px] font-medium hover:bg-opacity-90 transition-all"
          >
            Editar
          </button>
        </div>
      </td>
      {isSuperAdmin && (
        <td className="py-2.5 px-6">
          <div className="w-full mt-4 flex justify-center">
            <InlineInputGroup label="Agente">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none text-[14px] bg-white"
                value={agentType}
                onChange={handleAgentTypeChange}
              >
                <option value={AgentType.SOFIA_ASISTENTE}>Sofia</option>
                <option value={AgentType.CLAUDE}>Claude</option>
              </select>
            </InlineInputGroup>
          </div>
        </td>
      )}
    </tr>
  );
};

export default OrganizationCard;
