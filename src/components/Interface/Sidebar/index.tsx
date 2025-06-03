import { AppDispatch, RootState } from "@store";
import ItemSidebar from "./ItemSidebar";
import UserProfile from "./UserProfile";
import OrganizationHeaderItem from "./OrganizationHeaderItem";
import { useDispatch, useSelector } from "react-redux";
import { sidebarAdminLinks, sidebarLinks } from "@utils/lists";
import { logOutAsync } from "@store/actions/auth";
import { OrganizationRoleType } from "@utils/interfaces";
import { useState } from "react";
import ConfirmationModal from "@components/ConfirmationModal";

type SidebarProps = {
  sidebarMinimized: boolean;
  setSidebarMinimized: (value: boolean) => void;
  mobileResolution: boolean;
};

const Sidebar = ({
  sidebarMinimized,
  setSidebarMinimized,
  mobileResolution,
}: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectOrganizationId, user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await dispatch(logOutAsync());
    return true;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

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
    <div
      className={`transition-all duration-150 ease-in-out flex flex-col ${mobileResolution ? "" : ""} pr-[0px] ${sidebarMinimized || mobileResolution ? `${mobileResolution ? "w-[80px]" : "w-[100px]"}` : "w-[280px]"}`}
    >
      <div
        style={{
          height: "100vh",
        }}
        className={`fixed bg-[#F8F9FA] border border-gray-200 rounded-b-[4px] ${sidebarMinimized || mobileResolution ? `w-[80px]` : "w-[260px]"}`}
      >
        <div className="flex flex-col w-full h-full relative px-4">
          {!mobileResolution && (
            <div 
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 cursor-pointer rounded-full p-1"
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
            >
              {sidebarMinimized ? (
                <img src="/mvp/double-chevron-right.svg" alt="Expandir sidebar" className="w-6 h-6" />
              ) : (
                <img src="/mvp/double-chevron-left.svg" alt="Minimizar sidebar" className="w-6 h-6" />
              )}
            </div>
          )}
          <div className="flex h-[70px] p-[10px] justify-start">
            {sidebarMinimized || mobileResolution ? (
              <img
                className="select-none h-[24px] mt-[10px] cursor-pointer"
                src="/mvp/logo.svg"
                onClick={() => setSidebarMinimized(false)}
                alt="Logo"
              />
            ) : (
              <img
                className="select-none h-[24px] mt-[10px] cursor-pointer"
                src="/mvp/logo-sofia.svg"
                onClick={() => setSidebarMinimized(true)}
                alt="Logo"
              />
            )}
          </div>
          <div className="w-full border-b border-gray-200 mb-3"></div>
          <ul className="flex flex-col w-full gap-[15px]">
            {!sidebarMinimized && !mobileResolution && (
              <OrganizationHeaderItem 
                organizationName={myOrganizations.find(org => org.organization?.id === selectOrganizationId)?.organization?.name || "Organización"}
                sidebarMinimized={sidebarMinimized}
                mobileResolution={mobileResolution}
              />
            )}
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
              className={`mt-[18px] mb-[18px] flex h-[35px] items-center gap-[8px] ${sidebarMinimized || mobileResolution ? "w-full justify-center" : "w-full pl-[12px]"}`}
            >
              {(sidebarMinimized || mobileResolution) ? (
                <div className="group relative flex justify-center items-center">
                  <img
                    className="w-6 h-6 fill-current cursor-pointer"
                    src="/mvp/exit.svg"
                    onClick={handleLogoutClick}
                    alt="Cerrar sesión"
                  />
                  <div
                    className={`
                      absolute z-[9999] left-full group-hover:flex hidden 
                      bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
                      font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
                      shadow-md items-center
                    `}
                    style={{ 
                      marginLeft: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)'
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
                    onClick={handleLogoutClick}
                    alt="Cerrar sesión"
                  />
                  <p
                    onClick={handleLogoutClick}
                    className="font-normal text-[#001126] transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    Cerrar sesión
                  </p>
                </>
              )}
            </div>
            <UserProfile 
              sidebarMinimized={sidebarMinimized} 
              mobileResolution={mobileResolution} 
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isShown={showLogoutModal}
        title="Cierre de sesión"
        text="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default Sidebar;
