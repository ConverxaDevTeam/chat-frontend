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
    <div className="bg-[#f5faff] rounded-xl p-5 flex flex-col border-2 border-[#d3eafa] w-full min-h-[250px]">
      <div className="flex flex-col items-center gap-[16px] flex-1">
        <div className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[58px] h-[60px] rounded-full bg-sofiaCall-light overflow-hidden">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={`${organization.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-sofiaCall-dark font-poppinsSemiBold text-[24px]">
              {getInitials(organization.name)}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center h-full justify-between flex-1">
          <p className="text-[10px] font-bold text-gray-500 ">
            ID: {organization.id}
          </p>
          <p className="text-[20px] font-bold text-sofiaCall-dark">
            {organization.name}
          </p>

          <p className="text-center text-[15px] font-poppinsRegular text-sofiaCall-gray line-clamp-3">
            {organization.description}
          </p>

          <div className="flex flex-col items-center gap-0">
            <p className="text-[15px] font-bold text-sofiaCall-dark bg-sofiaCall-electricGreen px-[8px] py-[3px] rounded-full cursor-pointer">
              Usuarios
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {organization.users}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {hasDeletePermission && (
          <button
            onClick={onDelete}
            className="w-full px-4 py-1 text-gray-500 border-2 rounded-md text-sm font-semibold"
          >
            <span className="hidden sm:block">Eliminar</span>
          </button>
        )}
        <button
          onClick={onEdit}
          className="w-full px-4 py-1 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all"
        >
          <span className="hidden sm:block">Editar</span>
        </button>
      </div>
    </div>
  );
};

export default OrganizationCard;
