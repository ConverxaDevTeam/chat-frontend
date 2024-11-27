import { RootState } from "@store";
import ItemSidebar from "./ItemSidebar";
import { useSelector } from "react-redux";
import { sidebarAdminLinks, sidebarLinks } from "@utils/lists";

type SidebarProps = {
  windowHeight: number;
  sidebarMinimized: boolean;
  setSidebarMinimized: (value: boolean) => void;
  mobileResolution: boolean;
};
const Sidebar = ({
  windowHeight,
  sidebarMinimized,
  setSidebarMinimized,
  mobileResolution,
}: SidebarProps) => {
  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <>
      <div
        className={`transition-all duration-150 ease-in-out flex flex-col p-[20px] pr-[0px] ${sidebarMinimized || mobileResolution ? "w-[100px]" : "w-[280px]"}`}
      >
        <div
          style={{
            height: windowHeight - 40,
          }}
          className={`fixed bg-app-c2 border-[2px] border-app-c3 ${sidebarMinimized || mobileResolution ? "rounded-full w-[80px]" : "rounded-2xl w-[260px]"}`}
        >
          <div className="flex h-[100px] items-start justify-center">
            {sidebarMinimized || mobileResolution ? (
              <img
                className="select-none h-[40px] mt-[20px] ml-[3px] cursor-pointer"
                src="/demo/icon.png"
                onClick={() => setSidebarMinimized(false)}
                alt="Logo"
              />
            ) : (
              <img
                className="select-none h-[32px] mt-[20px] cursor-pointer"
                src="/demo/logo_color.png"
                onClick={() => setSidebarMinimized(true)}
                alt="Logo"
              />
            )}
          </div>
          <ul className="flex flex-col w-full pl-[10px]">
            {(selectOrganizationId === null && user?.is_super_admin) ||
            (selectOrganizationId === 0 && user?.is_super_admin)
              ? sidebarAdminLinks.map((link, index) => {
                  return (
                    <ItemSidebar
                      key={`${link.text}-${index}`}
                      link={link}
                      sidebarMinimized={sidebarMinimized}
                      mobileResolution={mobileResolution}
                    />
                  );
                })
              : sidebarLinks.map((link, index) => {
                  return (
                    <ItemSidebar
                      key={`${link.text}-${index}`}
                      link={link}
                      sidebarMinimized={sidebarMinimized}
                      mobileResolution={mobileResolution}
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
