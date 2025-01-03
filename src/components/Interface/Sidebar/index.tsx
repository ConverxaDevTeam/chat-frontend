import { AppDispatch, RootState } from "@store";
import ItemSidebar from "./ItemSidebar";
import { useDispatch, useSelector } from "react-redux";
import { sidebarAdminLinks, sidebarLinks } from "@utils/lists";
import { logOutAsync } from "@store/actions/auth";

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
  const dispatch = useDispatch<AppDispatch>();
  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <>
      <div
        className={`transition-all duration-150 ease-in-out flex flex-col ${
          mobileResolution ? "py-[10px]" : "p-[16px]"
        } pr-[0px] ${sidebarMinimized || mobileResolution ? `${mobileResolution ? "w-[80px]" : "w-[100px]"}` : "w-[280px]"}`}
      >
        <div
          style={{
            height: windowHeight - (mobileResolution ? 20 : 32),
          }}
          className={`bg-custom-gradient rounded-2xl border-[1px] border-[#B8CCE0] border-inherit fixed bg-app-c2 ${
            mobileResolution ? "border-r-[2px] border-y-[2px] " : "border-[2px]"
          } border-app-c3 ${
            sidebarMinimized || mobileResolution
              ? `w-[80px]`
              : "rounded-2xl w-[260px]"
          }`}
        >
          <div className="flex flex-col bg-[#F1F5F9] rounded-lg w-[calc(100%-24px)] h-[calc(100%-24px)] mt-[12px] ml-[12px] [box-shadow:0px_4px_8px_0px_rgba(201,_217,_232,_0.8)]">
            <div className="flex h-[107px] justify-center">
              {sidebarMinimized || mobileResolution ? (
                <img
                  className="select-none h-[24px] mt-[30px] cursor-pointer"
                  src="/mvp/icon.png"
                  onClick={() => setSidebarMinimized(false)}
                  alt="Logo"
                />
              ) : (
                <img
                  className="select-none h-[24px] mt-[30px] cursor-pointer"
                  src="/mvp/logo.png"
                  onClick={() => setSidebarMinimized(true)}
                  alt="Logo"
                />
              )}
            </div>
            <ul className="flex flex-col w-full gap-[36px]">
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
                        role={link.role || []}
                        sidebarMinimized={sidebarMinimized}
                        mobileResolution={mobileResolution}
                      />
                    );
                  })}
            </ul>
            <div
              className={`mt-auto mb-[38px] flex h-[35px] items-center gap-[16px] ${sidebarMinimized || mobileResolution ? "w-full justify-center" : "w-full pl-[12px]"}`}
            >
              <img
                className="w-6 h-6 fill-current cursor-pointer"
                src="/mvp/exit.svg"
                title="Cerrar sesión"
                onClick={() => dispatch(logOutAsync())}
                alt="Logo"
              />
              {!(sidebarMinimized || mobileResolution) && (
                <p
                  title="Cerrar sesión"
                  onClick={() => dispatch(logOutAsync())}
                  className="font-normal text-[#001126] transition-all duration-300 ease-in-out cursor-pointer"
                >
                  Cerrar sesión
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
