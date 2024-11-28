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
  mobileResolution: boolean;
};

const Navbar = ({
  windowWidth,
  sidebarMinimized,
  mobileResolution,
}: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [fixed, setFixed] = useState<boolean>(false);
  const [setting, setSetting] = useState<boolean>(false);

  return (
    <div
      className={`w-full ${mobileResolution ? "mt-[10px] h-[100px]" : "mt-[20px] h-[56px]"}`}
    >
      <div
        style={{
          width: fixed
            ? windowWidth - 40 - (sidebarMinimized ? 100 : 297)
            : "100%",
        }}
        className={`${fixed ? "fixed" : ""} flex ${mobileResolution ? "flex-col  h-[100px] p-[10px]" : "h-[56px]  px-[10px]"}  justify-between items-center bg-app-c2 border-[2px] border-app-c3 rounded-2xl`}
      >
        <div
          className={`flex gap-[10px] items-center ${mobileResolution ? "w-full" : ""}`}
        >
          <SelectOrganization mobileResolution={mobileResolution} />
          <p className="text-app-dark font-poppinsSemiBold text-[13px] w-[250px] hidden lg:block">
            {getFormattedDate()}
          </p>
        </div>
        <div
          className={`flex gap-[10px] items-center ${mobileResolution ? "ml-auto" : ""}`}
        >
          <p className="text-app-dark font-poppinsRegular text-[11px] hidden md:block lg:block">
            {user?.email}
          </p>
          <div className="bg-app-electricGreen rounded-full relative w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <FaMessage className="text-app-dark text-[16px]" />
            <div className="absolute bg-[#212121] w-[16px] h-[16px] rounded-full flex justify-center items-center -right-[5px] -bottom-[5px]">
              <p className="text-app-white text-[10px]">18</p>
            </div>
          </div>
          <div className="bg-app-electricGreen rounded-full relative w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <IoMdNotifications className="text-app-dark text-[22px]" />
            <div className="absolute bg-[#212121] w-[16px] h-[16px] rounded-full flex justify-center items-center -right-[5px] -bottom-[5px]">
              <p className="text-app-white text-[10px]">52</p>
            </div>
          </div>
          <div className="relative">
            <button
              className="select-none rounded-full bg-app-electricGreen cursor-pointer h-[30px] w-[30px] flex justify-center items-center"
              onClick={() => setSetting(!setting)}
              type="button"
            >
              <IoMdSettings className="text-app-dark text-[20px]" />
            </button>
            {setting && (
              <div className="absolute flex flex-col gap-[10px] w-[150px] right-0 items-start bg-app-white shadow-lg p-[10px] top-[50px] rounded-lg">
                <button
                  className="text-app-dark font-poppinsRegular text-[14px] cursor-pointer"
                  onClick={() => {
                    setFixed(!fixed);
                    setSetting(false);
                  }}
                  type="button"
                >
                  {fixed ? "Desbloquear" : "Bloquear"}
                </button>
                <p
                  onClick={() => {
                    dispatch(logOutAsync());
                    setSetting(false);
                  }}
                >
                  Cerrar sesión
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
