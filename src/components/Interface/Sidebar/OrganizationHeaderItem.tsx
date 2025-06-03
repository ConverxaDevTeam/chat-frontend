import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContextMenu from "@components/ContextMenu";

interface OrganizationHeaderItemProps {
  organizationName: string;
  sidebarMinimized: boolean;
  mobileResolution: boolean;
}

const OrganizationHeaderItem = ({
  organizationName,
  sidebarMinimized,
  mobileResolution,
}: OrganizationHeaderItemProps) => {
  const navigate = useNavigate();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleCloseMenu = () => {
    setShowContextMenu(false);
  };
  
  const navigateToUsers = () => {
    handleCloseMenu();
    navigate("/users");
  };

  if (sidebarMinimized || mobileResolution) {
    return (
      <li className="relative flex h-[35px] items-center justify-center w-full mb-2">
        <div className="group relative flex justify-center items-center">
          <img
            src="/mvp/layout-grid-plus.svg"
            alt="Organización"
            className="w-5 h-5 cursor-pointer"
          />
          <div
            className={`
              absolute z-[9999] left-full group-hover:flex hidden 
              bg-[#F6F6F6] border-[0.5px] border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
              font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
              shadow-md items-center pointer-events-none
            `}
            style={{
              marginLeft: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {organizationName}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="relative flex h-[35px] items-center justify-between w-full pl-[12px] pr-[12px]">
      <div className="flex items-center">
        <span className="font-bold text-[16px] text-[#001126]">
          {organizationName}
        </span>
      </div>
      <div className="relative">
        <button
          onClick={handleOpenMenu}
          className="p-0 flex items-center justify-center"
        >
          <img
            src="/mvp/ellipsis.svg"
            alt="Menú"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
        {showContextMenu && (
          <ContextMenu
            x={menuPosition.x}
            y={menuPosition.y}
            onClose={handleCloseMenu}
          >
            <button
              onClick={navigateToUsers}
              className="flex items-center gap-2 w-full text-left"
            >
              <img src="/mvp/plus.svg" alt="Agregar usuarios" className="w-4 h-4" />
              <span>Agregar usuarios</span>
            </button>
          </ContextMenu>
        )}
      </div>
    </li>
  );
};

export default OrganizationHeaderItem;
