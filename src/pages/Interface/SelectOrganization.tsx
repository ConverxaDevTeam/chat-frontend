import { RootState } from "@store";
import { ROLE_USER } from "@utils/interfaces";
import { useSelector } from "react-redux";
import { HiOutlineSelector } from "react-icons/hi";

const SelectOrganization = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (
    (user?.userOrganizations?.length ?? 0) === 0 &&
    user?.role === ROLE_USER.ADMIN
  ) {
    return (
      <div className="bg-app-white w-[180px] h-[30px] px-[10px] rounded-[4px] flex items-center justify-between">
        <p>Panel Admin</p>
        <HiOutlineSelector />
      </div>
    );
  }
  return <div>SelectOrganization</div>;
};

export default SelectOrganization;
