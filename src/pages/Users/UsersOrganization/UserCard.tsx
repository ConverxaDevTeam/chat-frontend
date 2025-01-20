import { getInitials } from "@utils/format";
import { IconEdit } from "@utils/svgs";
import { IUserApi } from ".";

interface UserCardProps {
  userData: IUserApi;
}

const UserCard = ({ userData }: UserCardProps) => {
  return (
    <>
      <div className="bg-white p-[30px] rounded-[24px] flex justify-between h-[140px] gap-[16px]">
        <div className="flex items-center gap-[16px] flex-1">
          <div className="flex justify-center items-center border-app-electricGreen border-[1px] w-[58px] h-[58px] rounded-full bg-app-lightGray">
            <p className="text-app-dark font-poppinsMedium text-[24px]">
              {userData.first_name
                ? getInitials(`${userData.first_name} ${userData.last_name}`)
                : "N/A"}
            </p>
          </div>

          <div className="flex flex-col h-full justify-between flex-1">
            <p className="text-[14px] font-poppinsRegular text-app-dark">
              {userData.first_name ? userData.first_name : "Sin registro"}
            </p>
            <p className="text-[10px] 2xl:text-[11px] font-poppinsRegular text-app-gray">
              {userData.email}
            </p>
            <div className="flex justify-between w-full">
              <p className="text-[14px] font-poppinsRegular text-app-dark">
                ID: {userData.id}
              </p>
              <p className="text-[12px] font-poppinsMedium text-app-dark bg-app-electricGreen px-[8px] py-[3px] rounded-full cursor-pointer">
                Rol:{" "}
                {userData.userOrganizations?.map(
                  organization => organization.role
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-[16px]">
          <IconEdit className="w-[24px] h-[24px] text-app-dark cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default UserCard;
