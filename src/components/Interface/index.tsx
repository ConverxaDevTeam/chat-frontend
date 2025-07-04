import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import BlockingPage from "./BlockingPage";
import Navbar from "./Navbar";
import PlanStatusBanner from "../PlanStatusBanner";
import Loading from "@components/Loading";
import { OrganizationStrip } from "../OrganizationStrip";

const Interface = () => {
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [sidebarMinimized, setSidebarMinimized] = useState<boolean>(false);
  const mobileResolution = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    // Trigger initial resize
    handleResize();

    // Update on orientation change for mobile
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    // Ensure the viewport height is set correctly
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!user) {
    return <Loading />;
  }

  const isGlobalUser =
    user?.is_super_admin || myOrganizations.some(org => !org.organization);

  if (myOrganizations?.length === 0 && user && !isGlobalUser) {
    return <BlockingPage />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Banner fuera del contenido principal para que desplace todo hacia abajo */}
      <PlanStatusBanner />

      {/* Contenido principal que se desplaza hacia abajo cuando el banner está presente */}
      <div className="flex flex-col flex-1 w-full bg-sofia-background overflow-hidden relative">
        <div className="flex flex-1 w-full overflow-hidden pl-[74px]">
          <OrganizationStrip />
          <Sidebar
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            mobileResolution={mobileResolution}
          />
          <div
            className={`flex flex-1 flex-col min-h-full overflow-hidden ${mobileResolution ? "pb-[10px]" : "pb-[20px]"}`}
          >
            <Navbar
              windowWidth={windowWidth}
              sidebarMinimized={sidebarMinimized}
              mobileResolution={mobileResolution}
            />
            <div className="flex-1 min-h-0 mt-4 mx-4 overflow-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
