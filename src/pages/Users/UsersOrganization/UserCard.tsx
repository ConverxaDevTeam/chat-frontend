import { getInitials } from "@utils/format";
import { IUserApi } from ".";

interface UserCardProps {
  userData: IUserApi;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard = ({ userData, onEdit, onDelete }: UserCardProps) => {
  return (
    <>
      <div className="bg-[#F1F5F9] rounded-xl p-5 flex flex-col border-2 border-[#DBEAF2] w-full min-h-[250px]">
        <div className="flex flex-col items-center gap-[16px] flex-1">
          <div className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[58px] h-[60px] rounded-full bg-sofiaCall-light overflow-hidden">
            <p className="text-sofiaCall-dark font-poppinsSemiBold text-[24px]">
              {userData.first_name
                ? getInitials(`${userData.first_name} ${userData.last_name}`)
                : "US"}
            </p>
          </div>

          <div className="flex flex-col h-full items-center justify-between flex-1">
          <div className="flex flex-row gap-2">
              <p className="text-[12px] 2xl:text-[12px] font-semibold text-app-gray">
                {userData.email} | ID: {userData.id}
              </p>
            </div>
            <p className="text-[14px] font-poppinsRegular text-app-dark">
              {userData.first_name ? userData.first_name : "Sin registro"}
            </p>
            <div className="flex flex-col items-center w-full">
              <p className="text-[12px] font-poppinsMedium text-app-dark bg-app-electricGreen px-[8px] py-[3px] rounded-full cursor-pointer">
                Rol:{" Agente"}
                {userData.userOrganizations?.map(
                  organization => organization.role
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
          <button
            onClick={onDelete}
            className="w-full px-4 py-1 text-gray-500 border-2 rounded-md text-sm font-semibold">
            Eliminar
          </button>
          <button
            onClick={onEdit}
            className="w-full px-4 py-1 bg-sofia-electricGreen text-gray-900 rounded-md text-sm font-semibold hover:bg-opacity-50 transition-all">
            Editar
          </button>
        </div>
      </div>
    </>
  );
};

export default UserCard;
