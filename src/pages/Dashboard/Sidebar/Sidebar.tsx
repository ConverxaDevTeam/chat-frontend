import { useDispatch } from "react-redux";
import { logOutAsync } from "../../../store/actions/auth";
import { AppDispatch } from "../../../store";
import { RxCross2 } from "react-icons/rx";
import { IconLogout } from "@utils/svgs";
import sidebarLinks from "./sidebarLinks";
import ItemSidebar from "./ItemSidebar";

type SidebarProps = {
  windowWidth: number;
  menuVisible: boolean;
  setMenuVisible: (value: boolean) => void;
};

const Sidebar = ({
  windowWidth,
  menuVisible,
  setMenuVisible,
}: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const visible = windowWidth < 768 ? menuVisible : true;

  return (
    <>
      {visible && (
        <div
          className={
            windowWidth < 768
              ? "fixed w-full h-full z-[100]"
              : "w-[300px] md:w-[290px] lg:w-[290px] xl:w-[300px] 2xl:w-[300px] border-[#9ca2ac]"
          }
        >
          <div className="flex border-r-[2px] border-r-[#9ca2ac] bg-[#f7f8f9] w-[300px] md:w-[290px] lg:w-[290px] xl:w-[300px] 2xl:w-[300px] h-full fixed top-0 left-0 flex-col items-center z-[100]">
            {windowWidth < 768 && (
              <RxCross2
                className="absolute w-10 h-10 text-sofiaCall-white top-3 right-3 cursor-pointer"
                onClick={() => setMenuVisible(false)}
              />
            )}
            <div className="flex h-[140px] items-center pl-[24px]">
              <img
                className="select-none w-[200px] md:w-[185px] lg:w-[185px] xl:w-[192px] 2xl:w-[200px]"
                src="/demo/logo_black.svg"
                alt="Logo"
              />
            </div>
            <ul className="flex flex-col w-full pl-[43px] md:pl-[36px] lg:pl-[36px] xl:pl-[38px] 2xl:pl-[43px] ml-auto">
              {sidebarLinks.map((link, index) => {
                return (
                  <ItemSidebar
                    key={`${link.text}-${index}`}
                    link={link}
                    setMenuVisible={setMenuVisible}
                  />
                );
              })}
            </ul>
            <div className="flex flex-1 flex-col justify-end w-full mb-[24px]">
              <div className="flex pl-[43px] md:pl-[36px] lg:pl-[36px] xl:pl-[38px] 2xl:pl-[43px] gap-[12px] items-center">
                <IconLogout
                  onClick={() => dispatch(logOutAsync())}
                  className="cursor-pointer ml-[24px] md:ml-[19px] lg:ml-[19px] xl:ml-[20px] 2xl:ml-[24px]"
                />
                <p
                  onClick={() => dispatch(logOutAsync())}
                  className="cursor-pointer text-[16px] font-poppinsRegular"
                >
                  Cerrar sesión
                </p>
              </div>
              <div className="h-[1px] w-[calc(100%-60px)] bg-app-dark mx-auto my-[24px]"></div>
              <p className="text-sofiaCall-white font-poppinsRegular text-[12px] pl-[43px] md:pl-[36px] lg:pl-[36px] xl:pl-[38px] 2xl:pl-[43px] ml-[24px] md:ml-[19px] lg:ml-[19px] xl:ml-[20px] 2xl:ml-[24px]">
                Demo version 1.0
              </p>
              <p className="text-app-dark text-[12px] text-center font-poppinsSemiBold">
                SOFI.A. © 2024 Derechos Reservados
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
