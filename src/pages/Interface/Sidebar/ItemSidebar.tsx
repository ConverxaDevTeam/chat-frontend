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
  setMenuVisible: (value: boolean) => void;
  sidebarMinimized: boolean;
}

const ItemSidebar = ({
  link,
  setMenuVisible,
  sidebarMinimized,
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
          ? "bg-web-color1 text-web-color4 border-web-color3"
          : "text-web-gray  border-[#ffffff00]"
      } ${active && sidebarMinimized ? "" : "pl-[16px]"}`}
    >
      {active && (
        <div className="absolute bg-web-color1 w-[24px] h-[24px] -right-[2px] -top-[24px] delay-0">
          <div className="w-full h-full bg-web-color2 rounded-br-full border-r-[2px] border-b-[2px] border-web-color3"></div>
        </div>
      )}
      {active && (
        <div className="absolute bg-web-color1 w-[2px] h-full -right-[2px] top-[0px]"></div>
      )}
      {active && (
        <div className="absolute bg-web-color1 w-[24px] h-[24px] -right-[2px] -bottom-[24px]">
          <div className="w-full h-full bg-web-color2 rounded-tr-full border-r-[2px] border-t-[2px] border-web-color3"></div>
        </div>
      )}

      <div
        className={
          active && sidebarMinimized
            ? "bg-web-color2 w-[46px] h-[46px] rounded-full border-[2px] border-web-color3 ml-[6px] text-web-color4 flex justify-center items-center"
            : ""
        }
      >
        <Icon
          className={`w-6 h-6 fill-current z-10 ${active ? "" : "cursor-pointer"}`}
          onClick={() => {
            navigate(link.to);
            setMenuVisible(false);
          }}
        />
      </div>
      <Link
        to={link.to}
        onClick={() => setMenuVisible(false)}
        className={`z-10 font-poppinsMedium text-[16px] transition-all duration-300 ease-in-out ${
          active ? "cursor-default" : "cursor-pointer"
        } ${sidebarMinimized ? "overflow-hidden w-0 opacity-0 scale-90" : "w-auto opacity-100 scale-100"}`}
      >
        {link.text}
      </Link>
    </li>
  );
};

export default ItemSidebar;
