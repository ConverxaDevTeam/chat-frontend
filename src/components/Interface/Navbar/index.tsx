import SelectOrganization from "./SelectOrganization";
import SelectDepartment from "./SelectDepartment";
import { RootState } from "@store";
import { useSelector } from "react-redux";

interface NavbarProps {
  windowWidth: number;
  sidebarMinimized: boolean;
  mobileResolution: boolean;
}

const Navbar = ({ mobileResolution }: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div
      className={`w-full ${mobileResolution ? "mt-[10px] h-[80px]" : "mt-[20px] h-[36px]"}`}
    >
      <div
        style={{
          width: "100%",
        }}
        className={`flex ${mobileResolution ? "flex-col  h-[100px] p-[10px]" : "h-[36px]"}  justify-between items-center`}
      >
        <div
          className={`flex gap-[10px] items-center ${mobileResolution ? "w-full" : ""}`}
        >
          <SelectOrganization mobileResolution={mobileResolution} />
          <SelectDepartment mobileResolution={mobileResolution} />
        </div>
        <div
          className={`flex gap-[10px] items-center ${mobileResolution ? "ml-auto" : ""}`}
        >
          <p className="text-sofia-superDark font-normal text-[14px] mr-[57px]">
            {user?.email}
          </p>
          <div className="bg-[#F1F5F9] rounded-lg border-[#B8CCE0] border-[2px] h-[36px] w-[150px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
