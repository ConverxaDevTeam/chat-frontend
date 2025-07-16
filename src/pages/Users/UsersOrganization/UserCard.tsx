import { getInitials } from "@utils/format";
import RoleBadge from "@components/RoleBadge";
import { IUserApi } from ".";
import InfoTooltip from "@components/common/InfoTooltip";

interface UserCardProps {
  userData: IUserApi;
  onEdit: () => void;
  onDelete: () => void;
  humanCommunication?: boolean;
  onToggleHumanCommunication?: () => void;
}

const UserCard = ({
  userData,
  onEdit,
  onDelete,
  humanCommunication = false,
  onToggleHumanCommunication,
}: UserCardProps) => {
  return (
    <>
      <div className="bg-white rounded p-4 flex flex-col border border-app-lightGray w-full min-h-[240px]">
        <div className="flex flex-col items-center gap-[16px] flex-1">
          <div className="flex justify-center items-center border-app-electricGreen border-[1px] w-[58px] h-[60px] rounded-full bg-app-light overflow-hidden">
            <p className="text-app-dark font-poppinsSemiBold text-[24px]">
              {userData.first_name
                ? getInitials(`${userData.first_name} ${userData.last_name}`)
                : "US"}
            </p>
          </div>

          <div className="flex flex-col h-full items-center justify-between flex-1 gap-1">
            <p className="text-[16px] 2xl:text-[16px] font-poppinsRegular text-app-dark">
              {userData.first_name ? userData.first_name : "Sin registro"}
            </p>
            <div className="flex flex-row gap-2">
              <p className="text-[14px] 2xl:text-[14px] font-normal text-app-dark">
                {userData.email}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="text-[10px] 2xl:text-[12px] font-normal text-app-newGray">
                Rol:{" "}
                {userData.userOrganizations?.map((organization, index) => (
                  <RoleBadge key={index} role={organization.role} />
                ))}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="text-[10px] 2xl:text-[12px] font-normal text-app-newGray">
                ID: {userData.id}
              </p>
            </div>
          </div>
          <hr className="w-full border-app-lightGray " />
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row gap-1">
              <p className="text-[14px] 2xl:text-[14px] font-normal text-app-superDark">
                Tomar conversaciones
              </p>
              <InfoTooltip text="Permite que este usuario tome el control de una conversación cuando la IA requiera ayuda." />
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={humanCommunication}
                onChange={onToggleHumanCommunication}
              />
              <div className="w-9 h-5 bg-gray-300 peer-checked:bg-[#001126] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
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
            className="w-full px-4 py-1 bg-app-superDark text-white rounded-[4px] text-sm font-normal hover:bg-opacity-50 transition-all whitespace-nowrap"
          >
            Editar contraseña
          </button>
        </div>
      </div>
    </>
  );
};

export default UserCard;
