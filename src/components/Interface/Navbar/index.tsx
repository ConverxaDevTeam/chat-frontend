import SelectOrganization from "./SelectOrganization";
import { IoMdSettings } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { logOutAsync } from "@store/actions/auth";
import { getFormattedDate } from "@utils/format";
import { useState, useRef } from "react";
import { AppDispatch, RootState } from "@store";
import { useDispatch, useSelector } from "react-redux";
import ContextMenu from "@components/ContextMenu";

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
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const handleSettingClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const button = event.currentTarget.getBoundingClientRect();
    setContextMenu(current =>
      current
        ? null
        : {
            x: button.right,
            y: button.bottom + 5,
          }
    );
  };

  const handleBlur = (event: React.FocusEvent) => {
    // Verificar si el nuevo elemento enfocado está dentro del menú
    if (
      settingsRef.current &&
      !settingsRef.current.contains(event.relatedTarget as Node)
    ) {
      setContextMenu(null);
    }
  };

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
          <div ref={settingsRef} className="relative" onBlur={handleBlur}>
            <button
              className="select-none rounded-full bg-app-electricGreen cursor-pointer h-[30px] w-[30px] flex justify-center items-center"
              onClick={handleSettingClick}
              type="button"
            >
              <IoMdSettings className="text-app-dark text-[20px]" />
            </button>
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={() => setContextMenu(null)}
              >
                <div className="flex flex-col gap-[10px]">
                  <button
                    className="text-app-dark font-poppinsRegular text-[14px] cursor-pointer hover:bg-gray-100 w-full text-left px-2 py-1 rounded"
                    onClick={() => {
                      setFixed(!fixed);
                      setContextMenu(null);
                    }}
                    type="button"
                  >
                    {fixed ? "Desbloquear" : "Bloquear"}
                  </button>
                  <button
                    className="text-app-dark font-poppinsRegular text-[14px] cursor-pointer hover:bg-gray-100 w-full text-left px-2 py-1 rounded"
                    onClick={() => {
                      dispatch(logOutAsync());
                      setContextMenu(null);
                    }}
                    type="button"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </ContextMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
