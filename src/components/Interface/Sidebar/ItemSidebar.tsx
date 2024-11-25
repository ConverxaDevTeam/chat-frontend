import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ItemSidebarProps {
  link: {
    to: string;
    text: string;
    active: string[];
    Icon:
      | React.FC<React.SVGProps<SVGSVGElement>>
      | React.FC<React.ComponentProps<"svg">>;
  };
  sidebarMinimized: boolean;
  mobileResolution: boolean;
}

const ItemSidebar = ({
  link,
  sidebarMinimized,
  mobileResolution,
}: ItemSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const active = currentPath === link.to || link.active.includes(currentPath);

  const { Icon } = link;

  return (
    <li
      className={`relative flex rounded-l-full items-center h-[60px] border-[2px] border-r-0 gap-[12px] ${
        active
          ? "bg-app-c1 text-app-c4 border-app-c3"
          : "text-app-gray  border-[#ffffff00]"
      } ${active && (sidebarMinimized || mobileResolution) ? "" : "pl-[16px]"}`}
    >
      {active && (
        <div className="absolute bg-app-c1 w-[24px] h-[24px] -right-[2px] -top-[24px] delay-0">
          <div className="w-full h-full bg-app-c2 rounded-br-full border-r-[2px] border-b-[2px] border-app-c3"></div>
        </div>
      )}
      {active && (
        <div className="absolute bg-app-c1 w-[2px] h-full -right-[2px] top-[0px]"></div>
      )}
      {active && (
        <div className="absolute bg-app-c1 w-[24px] h-[24px] -right-[2px] -bottom-[24px]">
          <div className="w-full h-full bg-app-c2 rounded-tr-full border-r-[2px] border-t-[2px] border-app-c3"></div>
        </div>
      )}

      <div
        className={
          active && (sidebarMinimized || mobileResolution)
            ? "bg-app-c2 w-[46px] h-[46px] rounded-full border-[2px] border-app-c3 ml-[6px] text-app-c4 flex justify-center items-center"
            : ""
        }
      >
        <Icon
          className={`w-6 h-6 fill-current z-10 ${active ? "" : "cursor-pointer"}`}
          onClick={() => {
            navigate(link.to);
          }}
        />
      </div>
      <Link
        to={link.to}
        className={`z-10 font-poppinsMedium text-[16px] transition-all duration-300 ease-in-out ${
          active ? "cursor-default" : "cursor-pointer"
        } ${sidebarMinimized || mobileResolution ? "overflow-hidden w-0 opacity-0 scale-90" : "w-auto opacity-100 scale-100"}`}
      >
        {link.text}
      </Link>
    </li>
  );
};

export default ItemSidebar;
