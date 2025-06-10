import { getInitials } from "@utils/format";
import RoleBadge from "@components/RoleBadge";
import { IUserApi } from ".";

interface UserCardProps {
  userData: IUserApi;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard = ({ userData, onEdit, onDelete }: UserCardProps) => {
  return (
    <>
      <div className="bg-white rounded p-4 flex flex-col border border-app-lightGray w-full min-h-[240px]">
        <div className="flex flex-col items-center gap-[16px] flex-1">
          <div className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[58px] h-[60px] rounded-full bg-sofiaCall-light overflow-hidden">
            <p className="text-sofiaCall-dark font-poppinsSemiBold text-[24px]">
              {userData.first_name
                ? getInitials(`${userData.first_name} ${userData.last_name}`)
                : "US"}
            </p>
          </div>

          <div className="flex flex-col h-full items-center justify-between flex-1">
            <p className="text-[14px] font-poppinsRegular text-app-dark">
              {userData.first_name ? userData.first_name : "Sin registro"}
            </p>
            <div className="flex flex-col items-center w-full">
              {userData.userOrganizations?.map((organization, index) => (
                <RoleBadge 
                  key={index} 
                  role={organization.role} 
                  className="cursor-pointer"
                />
              ))}
            </div>
            <div className="flex flex-row gap-2">
              <p className="text-[13px] 2xl:text-[13px] font-normal text-app-newGray">
                {userData.email} / ID: {userData.id}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
          <button
            onClick={onDelete}
            className="w-full px-4 py-1 text-app-newGray border rounded-[4px] text-sm font-normal"
          >
            Eliminar
          </button>
          <button
            onClick={onEdit}
            className="w-full px-4 py-1 bg-sofia-superDark text-white rounded-[4px] text-sm font-normal hover:bg-opacity-50 transition-all"
          >
            Editar
          </button>
        </div>
      </div>
    </>
  );
};

export default UserCard;
