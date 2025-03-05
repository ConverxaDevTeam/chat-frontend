import { getInitials } from "@utils/format";
import { useRoleAuth } from "@hooks/useRoleAuth";
import { IOrganization } from "@interfaces/organization.interface";

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
  return (
    <tr className="hover:bg-[#f5faff] border-b transition-all">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[40px] h-[40px] rounded-full bg-sofiaCall-light overflow-hidden flex-shrink-0">
            {organization.logo ? (
              <img
                src={organization.logo}
                alt={`${organization.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-sofiaCall-dark font-poppinsSemiBold text-[16px]">
                {getInitials(organization.name)}
              </p>
            )}
          </div>
          <span className="font-semibold text-sofiaCall-dark">
            {organization.name}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-500">
        {organization.id}
      </td>
      <td className="py-4 px-4 max-w-[300px]">
        <p className="text-sm text-sofiaCall-gray line-clamp-1">
          {organization.description}
        </p>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="text-sm font-semibold text-sofiaCall-dark bg-sofiaCall-electricGreen px-3 py-1 rounded-full">
          {organization.users}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-end gap-2">
          {hasDeletePermission && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-gray-500 border rounded-md text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
          >
            Editar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrganizationCard;
