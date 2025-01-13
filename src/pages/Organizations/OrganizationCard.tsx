import { IOrganizarion } from ".";
import { getInitials } from "@utils/format";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface OrganizationCardProps {
  organization: IOrganizarion;
  onEdit: () => void;
  onDelete: () => void;
}

const OrganizationCard = ({
  organization,
  onEdit,
  onDelete,
}: OrganizationCardProps) => {
  return (
    <div className="bg-app-c2 p-[30px] rounded-[8px] flex justify-between h-[140px] gap-[16px] border-[1px] border-app-c3">
      <div className="flex items-center gap-[16px] flex-1">
        <div className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[58px] h-[58px] rounded-full bg-sofiaCall-light">
          <p className="text-sofiaCall-dark font-poppinsSemiBold text-[24px]">
            {getInitials(organization.name)}
          </p>
        </div>
        <div className="flex flex-col h-full justify-between flex-1">
          <p className="text-[14px] font-poppinsRegular text-sofiaCall-dark">
            {organization.name}
          </p>
          <p className="text-[10px] 2xl:text-[11px] font-poppinsRegular text-sofiaCall-gray">
            {organization.description}
          </p>
          <div className="flex justify-between w-full">
            <p className="text-[14px] font-poppinsRegular text-sofiaCall-dark">
              ID: {organization.id}
            </p>
            <p className="text-[12px] font-poppinsMedium text-sofiaCall-dark bg-sofiaCall-electricGreen px-[8px] py-[3px] rounded-full cursor-pointer">
              {organization.users} Usuarios
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-[16px]">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
