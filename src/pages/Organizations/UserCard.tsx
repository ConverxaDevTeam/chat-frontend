import { IOrganizarion } from ".";
// import { getInitials } from "@utils/format";
// import { IconEdit } from "@utils/svgs";
// import { apiUrls } from "../../config/config";
// import { MdAdminPanelSettings } from "react-icons/md";

interface OrganizationCardProps {
  organization: IOrganizarion;
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  return (
    <div className="bg-sofiaCall-white p-[30px] rounded-[24px] flex justify-between h-[140px] gap-[16px]">
      <p>{organization.name}</p>
      {/* <div className="flex items-center gap-[16px] flex-1">
        {userData.avatar ? (
          <img
            src={apiUrls.getImgAvatar(userData.avatar)}
            className="w-[58px] h-[58px] object-cover rounded-full select-none"
            alt="avatar"
          />
        ) : (
          <div className="flex justify-center items-center border-sofiaCall-electricGreen border-[1px] w-[58px] h-[58px] rounded-full bg-sofiaCall-light">
            <p className="text-sofiaCall-dark font-poppinsSemiBold text-[24px]">
              {userData.first_name
                ? getInitials(`${userData.first_name} ${userData.last_name}`)
                : "N/A"}
            </p>
          </div>
        )}
        <div className="flex flex-col h-full justify-between flex-1">
          <p className="text-[14px] font-poppinsRegular text-sofiaCall-dark">
            {userData.first_name ? userData.first_name : "No registration"}
          </p>
          <p className="text-[10px] 2xl:text-[11px] font-poppinsRegular text-sofiaCall-gray">
            {userData.email}
          </p>
          <div className="flex justify-between w-full">
            <p className="text-[14px] font-poppinsRegular text-sofiaCall-dark">
              ID: {userData.id}
            </p>
            <p
              onClick={() => setModalGenerateTransaction(true)}
              className="text-[12px] font-poppinsMedium text-sofiaCall-dark bg-sofiaCall-electricGreen px-[8px] py-[3px] rounded-full cursor-pointer"
            >
              Saldo: {`$${((userData?.balance || 0) / 1000000).toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-[16px]">
        <IconEdit
          onClick={() => setModalEditUser(true)}
          className="w-[24px] h-[24px] text-sofiaCall-dark cursor-pointer"
        />
        {userData.role === "admin" && (
          <MdAdminPanelSettings
            className={`w-[24px] h-[24px] text-sofiaCall-dark ${user?.role === "owner" ? "cursor-pointer" : ""}`}
            title={userData.role}
            onClick={() => {
              if (user?.role !== "owner") return;
              setModalRemoveAdmin(true);
            }}
          />
        )}
        {userData.role === "owner" && (
          <MdAdminPanelSettings
            className="w-[24px] h-[24px] text-sofiaCall-electricGreen text-opacity-60"
            title={userData.role}
          />
        )}
        {userData.role === "user" && (
          <MdAdminPanelSettings
            className={`w-[24px] h-[24px] text-sofiaCall-gray text-opacity-80 ${user?.role === "owner" ? "cursor-pointer" : ""}`}
            title="sin rol"
            onClick={() => {
              if (user?.role !== "owner") return;
              setModalActiveAdmin(true);
            }}
          />
        )}
      </div> */}
    </div>
  );
};

export default OrganizationCard;
