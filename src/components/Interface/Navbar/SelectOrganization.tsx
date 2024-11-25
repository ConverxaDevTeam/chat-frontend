import { RootState } from "@store";
import { useSelector } from "react-redux";
import { HiOutlineSelector } from "react-icons/hi";

const SelectOrganization = () => {
  const { user, organizations } = useSelector((state: RootState) => state.auth);
  if ((organizations?.length ?? 0) === 0 && user?.is_super_admin) {
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
