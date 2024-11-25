import { RootState } from "@store";
import { ROLE } from "@utils/interfaces";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ItemSidebarProps {
  link: {
    to: string;
    text: string;
    roles: ROLE[];
    active: string[];
    Icon:
      | React.FC<React.SVGProps<SVGSVGElement>>
      | React.FC<React.ComponentProps<"svg">>;
  };
  setMenuVisible: (value: boolean) => void;
}

const ItemSidebar = ({ link, setMenuVisible }: ItemSidebarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  if (!link.roles.includes(user?.role as ROLE)) return null;

  const active = currentPath === link.to || link.active.includes(currentPath);

  const { Icon } = link;

  return (
    <li
      className={`relative flex rounded-l-full items-center pl-[16px] h-[60px] border-[2px] border-r-0 gap-[12px] ${
        active
          ? "bg-app-white text-app-dark border-[#9ca2ac]"
          : "text-app-dark  border-[#ffffff00]"
      }`}
    >
      {active && (
        <div className="absolute bg-app-white w-[24px] h-[24px] -right-[2px] -top-[24px]">
          <div className="w-full h-full bg-[#f7f8f9] rounded-br-full border-r-[2px] border-b-[2px] border-[#9ca2ac]"></div>
        </div>
      )}
      {active && (
        <div className="absolute bg-app-white w-[2px] h-full -right-[2px] top-[0px]"></div>
      )}
      {active && (
        <div className="absolute bg-app-white w-[24px] h-[24px] -right-[2px] -bottom-[24px]">
          <div className="w-full h-full bg-[#f7f8f9] rounded-tr-full border-r-[2px] border-t-[2px] border-[#9ca2ac]"></div>
        </div>
      )}
      <Icon
        className="w-6 h-6 cursor-pointer fill-current z-10"
        onClick={() => {
          navigate(link.to);
          setMenuVisible(false);
        }}
      />
      <Link
        to={link.to}
        onClick={() => setMenuVisible(false)}
        className="z-10 font-poppinsMedium text-[16px]s"
      >
        {link.text}
      </Link>
    </li>
  );
};

export default ItemSidebar;
