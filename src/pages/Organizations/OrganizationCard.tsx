import { IOrganizarion } from ".";
import { getInitials } from "@utils/format";
import { IconEdit } from "@utils/svgs";

interface OrganizationCardProps {
  organization: IOrganizarion;
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
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
        <IconEdit className="w-[24px] h-[24px] text-sofiaCall-dark cursor-pointer" />
      </div>
    </div>
  );
};

export default OrganizationCard;
