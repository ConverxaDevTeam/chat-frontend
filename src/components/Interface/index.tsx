import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import BlockingPage from "./BlockingPage";

import Navbar from "./Navbar";

const Interface = () => {
  const { user, organizations } = useSelector((state: RootState) => state.auth);
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

  if ((organizations?.length ?? 0) === 0 && !user?.is_super_admin) {
    return <BlockingPage />;
  }

  return (
    <div className={`flex w-full min-h-full bg-app-c1 overflow-y-auto`}>
      <Sidebar
        windowHeight={windowHeight}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
        mobileResolution={mobileResolution}
      />
      <div className={`flex flex-1 flex-col p-[20px]`}>
        <Navbar windowWidth={windowWidth} sidebarMinimized={sidebarMinimized} />
          <Outlet />
      </div>
    </div>
  );
};

export default Interface;
