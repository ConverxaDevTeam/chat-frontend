import { AppDispatch, RootState } from "@store";
import ItemSidebar from "./ItemSidebar";
import { useDispatch, useSelector } from "react-redux";
import { sidebarAdminLinks, sidebarLinks } from "@utils/lists";
import { logOutAsync } from "@store/actions/auth";
import { OrganizationRoleType } from "@utils/interfaces";

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
  const { selectOrganizationId, user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  const userRoles = myOrganizations.map(organization => organization.role);
  const sidebarAdminRoles = [OrganizationRoleType.ING_PREVENTA];
  const useSidebarAdmin =
    user?.is_super_admin ||
    userRoles.some(role => sidebarAdminRoles.includes(role));
  const userSidebarAdminLinks = sidebarAdminLinks.filter(
    link =>
      user?.is_super_admin || link.roles?.some(role => userRoles.includes(role))
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
          className={`bg-custom-gradient rounded-[4px] border-[1px] border-[#B8CCE0] border-inherit fixed bg-app-c2 ${
            mobileResolution ? "border-r-[2px] border-y-[2px] " : "border-[2px]"
          } border-app-c3 ${
            sidebarMinimized || mobileResolution
              ? `w-[80px]`
              : "rounded-[4px] w-[260px]"
          }`}
        >
          <div className="flex flex-col bg-[#F1F5F9] rounded-[4px] w-[calc(100%-24px)] h-[calc(100%-24px)] mt-[12px] ml-[12px] [box-shadow:0px_4px_10px_0px_rgba(201,_217,_232,_0.8)] relative">
            {!mobileResolution && (
              <div
                className="absolute -right-7 top-1/2 transform -translate-y-1/2 cursor-pointer rounded-full p-1"
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
              >
                {sidebarMinimized ? (
                  <img
                    src="/mvp/circle-chevron-right.svg"
                    alt="Expandir sidebar"
                    className="w-6 h-6"
                  />
                ) : (
                  <img
                    src="/mvp/circle-chevron-left.svg"
                    alt="Minimizar sidebar"
                    className="w-6 h-6"
                  />
                )}
              </div>
            )}
            <div className="flex h-[107px] p-[10px] justify-start">
              {sidebarMinimized || mobileResolution ? (
                <img
                  className="select-none h-[24px] mt-[20px] cursor-pointer"
                  src="/mvp/logo.svg"
                  onClick={() => setSidebarMinimized(false)}
                  alt="Logo"
                />
              ) : (
                <img
                  className="select-none h-[24px] mt-[20px] cursor-pointer"
                  src="/mvp/logo-sofia.svg"
                  onClick={() => setSidebarMinimized(true)}
                  alt="Logo"
                />
              )}
            </div>
            <ul className="flex flex-col w-full gap-[15px]">
              {(selectOrganizationId === null && useSidebarAdmin) ||
              (selectOrganizationId === 0 && useSidebarAdmin)
                ? userSidebarAdminLinks.map((link, index) => {
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
            <div className="mt-auto">
              {!(sidebarMinimized || mobileResolution) && (
                <div className="mx-auto bg-[#343E4F] w-[193px] h-[141px] rounded-[4px] p-[16px] gap-[16px] flex flex-col ">
                  <p className="text-white text-[16px]">
                    ¿Necesitas ayuda? Visita nuestro centro de soporte
                  </p>
                  <button
                    type="button"
                    className="text-[12px] text-sofia-navyBlue bg-white border-sofia-navyBlue border-[1px] py-[4px] px-[8px] rounded-[4px]"
                  >
                    Ir ahora
                  </button>
                </div>
              )}
              <div
                className={`mt-[18px] mb-[38px] flex h-[35px] items-center gap-[16px] ${sidebarMinimized || mobileResolution ? "w-full justify-center" : "w-full pl-[12px]"}`}
              >
                {sidebarMinimized || mobileResolution ? (
                  <div className="group relative flex justify-center items-center">
                    <img
                      className="w-6 h-6 fill-current cursor-pointer"
                      src="/mvp/exit.svg"
                      onClick={() => dispatch(logOutAsync())}
                      alt="Cerrar sesión"
                    />
                    <div
                      className={`
                        absolute z-50 left-full group-hover:flex hidden 
                        bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
                        font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
                        shadow-md items-center
                      `}
                      style={{
                        marginLeft: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      Cerrar sesión
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      className="w-6 h-6 fill-current cursor-pointer"
                      src="/mvp/exit.svg"
                      onClick={() => dispatch(logOutAsync())}
                      alt="Cerrar sesión"
                    />
                    <p
                      onClick={() => dispatch(logOutAsync())}
                      className="font-normal text-[#001126] transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      Cerrar sesión
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
