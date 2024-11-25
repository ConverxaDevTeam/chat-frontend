import SelectOrganization from "./SelectOrganization";
import { IoMdSettings } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { logOutAsync } from "@store/actions/auth";
import { getFormattedDate } from "@utils/format";
import { useState } from "react";
import { AppDispatch, RootState } from "@store";
import { useDispatch, useSelector } from "react-redux";

type NavbarProps = {
  windowWidth: number;
  sidebarMinimized: boolean;
};

const Navbar = ({ windowWidth, sidebarMinimized }: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [fixed, setFixed] = useState<boolean>(false);
  const [setting, setSetting] = useState<boolean>(false);

  return (
    <div className="w-full h-[56px]">
      <div
        style={{
          width: fixed
            ? windowWidth - 40 - (sidebarMinimized ? 100 : 297)
            : "100%",
        }}
        className={`${fixed ? "fixed" : ""} flex justify-between items-center h-[56px] px-[10px] bg-app-c2 border-[2px] border-app-c3 rounded-2xl`}
      >
        <div className="flex gap-[10px] items-center">
          <SelectOrganization />
          <p className="text-app-dark font-poppinsSemiBold text-[18px]">
            {getFormattedDate()}
          </p>
        </div>
        <div className="flex gap-[10px] items-center">
          <p className="text-app-dark font-poppinsRegular text-[12px]">
            {user?.email}
          </p>
          <div className="bg-app-background rounded-full relative w-[36px] h-[36px] cursor-pointer flex justify-center items-center">
            <FaMessage className="text-app-dark text-[16px]" />
            <div className="absolute bg-[#212121] w-[16px] h-[16px] rounded-full flex justify-center items-center -right-[5px] -bottom-[5px]">
              <p className="text-app-white text-[10px]">18</p>
            </div>
          </div>
          <div className="bg-app-electricGreen rounded-full relative w-[36px] h-[36px] cursor-pointer flex justify-center items-center">
            <IoMdNotifications className="text-app-dark text-[22px]" />
            <div className="absolute bg-[#212121] w-[16px] h-[16px] rounded-full flex justify-center items-center -right-[5px] -bottom-[5px]">
              <p className="text-app-white text-[10px]">52</p>
            </div>
          </div>
          <div className="relative">
            <button
              className="select-none rounded-full bg-app-electricGreen cursor-pointer h-[36px] w-[36px] flex justify-center items-center"
              onClick={() => setSetting(!setting)}
              type="button"
            >
              <IoMdSettings className="text-app-dark text-[20px]" />
            </button>
            {setting && (
              <div className="absolute flex flex-col gap-[10px] w-[150px] right-0 items-start bg-app-white shadow-lg p-[10px] top-[50px] rounded-lg">
                <button
                  className="text-app-dark font-poppinsRegular text-[14px] cursor-pointer"
                  onClick={() => setFixed(!fixed)}
                  type="button"
                >
                  {fixed ? "Desbloquear" : "Bloquear"}
                </button>
                <p onClick={() => dispatch(logOutAsync())}>Cerrar sesión</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
