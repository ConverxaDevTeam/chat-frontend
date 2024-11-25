import { RootState } from "@store";
import ItemSidebar from "./ItemSidebar";
import sidebarLinks, { sidebarAdminLinks } from "./sidebarLinks";
import { useSelector } from "react-redux";
import { ROLE_USER } from "../../../utils/interfaces";

type SidebarProps = {
  windowWidth: number;
  windowHeight: number;
  menuVisible: boolean;
  setMenuVisible: (value: boolean) => void;
  sidebarMinimized: boolean;
  setSidebarMinimized: (value: boolean) => void;
};
const Sidebar = ({
  windowWidth,
  windowHeight,
  menuVisible,
  setMenuVisible,
  sidebarMinimized,
  setSidebarMinimized,
}: SidebarProps) => {
  const visible = windowWidth < 768 ? menuVisible : true;
  const { theme, selectOrganization, user } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <>
      <div
        className={`transition-all duration-150 ease-in-out flex flex-col p-[20px] pr-[0px] ${sidebarMinimized ? "w-[100px]" : "w-[280px]"}`}
      >
        <div
          style={{
            height: windowHeight - 40,
          }}
          className={`fixed bg-web-color2 border-[2px] border-web-color3 ${sidebarMinimized ? "rounded-full w-[80px]" : "rounded-2xl w-[260px]"}`}
        >
          <div className="flex h-[100px] items-start justify-center">
            {sidebarMinimized ? (
              <img
                className="select-none h-[40px] mt-[20px] ml-[3px] cursor-pointer"
                src={
                  theme === "light" ? "/demo/icon.png" : "/demo/icon_white.png"
                }
                onClick={() => setSidebarMinimized(false)}
                alt="Logo"
              />
            ) : (
              <img
                className="select-none h-[32px] mt-[20px] cursor-pointer"
                src={
                  theme === "light"
                    ? "/demo/logo_color.png"
                    : "/demo/logo_white.png"
                }
                onClick={() => setSidebarMinimized(true)}
                alt="Logo"
              />
            )}
          </div>
          <ul className="flex flex-col w-full pl-[10px]">
            {selectOrganization === null && user?.role === ROLE_USER.ADMIN
              ? sidebarAdminLinks.map((link, index) => {
                  return (
                    <ItemSidebar
                      key={`${link.text}-${index}`}
                      link={link}
                      setMenuVisible={setMenuVisible}
                      sidebarMinimized={sidebarMinimized}
                    />
                  );
                })
              : sidebarLinks.map((link, index) => {
                  return (
                    <ItemSidebar
                      key={`${link.text}-${index}`}
                      link={link}
                      setMenuVisible={setMenuVisible}
                      sidebarMinimized={sidebarMinimized}
                    />
                  );
                })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
