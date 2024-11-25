import Sidebar from "./Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { RiMenuFill } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import Search from "./Search";

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`flex flex-col w-full min-h-full md:flex-row overflow-y-auto  ${
        windowWidth < 768 ? "bg-sofiaCall-light" : "bg-[#f7f8f9]"
      }`}
    >
      <Sidebar
        windowWidth={windowWidth}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
      />
      {windowWidth < 768 && (
        <div className="flex justify-between items-center bg-sofiaCall-black h-[90px] px-[40px] rounded-b-[42px]">
          <img src="/images/logo_black.png" alt="Logo" className="h-[50px]" />
          <RiMenuFill
            className="w-[36px] h-[36px] text-sofiaCall-white"
            onClick={() => setMenuVisible(true)}
          />
        </div>
      )}
      <div
        className={`flex flex-col px-[20px] md:px-[24px] lg:px-[24px] xl:px-[30px] 2xl:px-[50px] pb-[20px] md:pb-[24px] lg:pb-[24px] xl:pb-[30px] 2xl:pb-[50px] bg-app-white ${
          windowWidth < 768
            ? "w-full"
            : "w-[calc(100%-345px)] md:w-[calc(100%-290px)] lg:w-[calc(100%-290px)] xl:w-[calc(100%-300px)] 2xl:w-[calc(100%-345px)]"
        }`}
      >
        <Search />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
