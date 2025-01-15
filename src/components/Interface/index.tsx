import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import BlockingPage from "./BlockingPage";

import Navbar from "./Navbar";
import Loading from "@components/Loading";

const Interface = () => {
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [sidebarMinimized, setSidebarMinimized] = useState<boolean>(false);
  const mobileResolution = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!user) {
    return <Loading />;
  }

  if (myOrganizations?.length === 0 && user && !user?.is_super_admin) {
    return <BlockingPage />;
  }

  return (
    <div className={`flex w-full h-full bg-sofia-background overflow-y-auto`}>
      <Sidebar
        windowHeight={windowHeight}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
        mobileResolution={mobileResolution}
      />
      <div
        className={`flex flex-1 flex-col ${mobileResolution ? "px-[10px] gap-[10px] pb-[10px]" : "px-[20px] gap-[20px] pb-[20px]"}`}
      >
        <Navbar
          windowWidth={windowWidth}
          sidebarMinimized={sidebarMinimized}
          mobileResolution={mobileResolution}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default Interface;
