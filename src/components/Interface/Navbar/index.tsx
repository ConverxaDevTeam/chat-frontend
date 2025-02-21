import SelectOrganization from "./SelectOrganization";
import SelectDepartment from "./SelectDepartment";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getNotifications } from "@services/notifications.service";
import { useState } from "react";
import ContextMenu from "@components/ContextMenu";
import { Notification } from "@interfaces/notification.interface";

interface NavbarProps {
  windowWidth: number;
  sidebarMinimized: boolean;
  mobileResolution: boolean;
}

interface BreadcrumbItem {
  path: string;
  label: string;
}

const breadcrumbMap: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/workspace": "Espacios de Trabajo",
  "/conversations": "Conversaciones",
  "/departments": "Departamentos",
  "/users": "Usuarios",
};

const Breadcrumb = ({
  breadcrumbItems,
}: {
  breadcrumbItems: BreadcrumbItem[];
}) => {
  return (
    <div className="text-[14px] text-gray">
      {breadcrumbItems.map((item, index) => (
        <span key={index}>
          {index > 0 && " / "}
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-bold">{item.label}</span>
          ) : (
            <Link to={item.path} className="text-black-500 hover:underline">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
};

const UserActions = ({
  user,
  mobileResolution,
  contextMenu,
  setContextMenu,
}: {
  user: any;
  mobileResolution: boolean;
  contextMenu: { x: number; y: number; notifications: Notification[] } | null;
  setContextMenu: (
    contextMenu: { x: number; y: number; notifications: Notification[] } | null
  ) => void;
}) => {
  const handleBellClick = async (event: React.MouseEvent) => {
    const notifications = await getNotifications();
    const { clientX, clientY } = event;
    setContextMenu({ x: clientX, y: clientY, notifications });
  };

  return (
    <div
      className={`flex gap-[8px] items-center ${mobileResolution ? "ml-auto" : ""}`}
    >
      <p className="text-sofia-superDark font-normal text-[14px] mr-3">
        {user?.email}
      </p>
      <div
        className={`bg-white  border border-gray-300 shadow-sm border-inherit max-w-[148px] h-[36px] relative rounded-lg flex justify-between items-center gap- p-3 cursor-pointer ${
          mobileResolution ? "w-full" : "w-[200px]"
        }`}
      >
        <img
          src="/mvp/bell.svg"
          alt="Bell"
          className="w-5 h-5"
          onClick={handleBellClick}
        />
        <img src="/mvp/settings.svg" alt="Settings" className="w-5 h-5" />
        <img src="/mvp/spanish.svg" alt="Language" className="w-5 h-5" />
        <img
          src="/mvp/chevron-down.svg"
          alt="Chevron down"
          className="w-5 h-5"
        />
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        >
          {contextMenu.notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => {
                if (notification.link) window.location.href = notification.link;
                setContextMenu(null);
              }}
            >
              <div className="text-sm truncate max-w-[300px]">
                {notification.title}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(notification.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </ContextMenu>
      )}
    </div>
  );
};

const Navbar = ({ mobileResolution }: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const pathSegments = location.pathname
    .split("/")
    .filter(Boolean)
    .filter(segment => segment !== "dashboard");

  let accumulatedPath = "";
  const breadcrumbItems = [
    { path: "/dashboard", label: "Dashboard" },
    ...pathSegments.map(segment => {
      accumulatedPath += `/${segment}`;
      return {
        path: accumulatedPath,
        label: breadcrumbMap[accumulatedPath] || decodeURIComponent(segment),
      };
    }),
  ];

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    notifications: Notification[];
  } | null>(null);

  return (
    <>
      <div
        className={`w-full ${mobileResolution ? "mt-[10px] h-[80px]" : "mt-[20px] h-[36px]"}`}
      >
        <div
          style={{
            width: "100%",
          }}
          className={`flex ${mobileResolution ? "flex-col  h-[100px] p-[10px]" : "h-[36px]"}  justify-between items-center `}
        >
          <div className="flex md:flex-row flex-col items-start md:items-center gap-7 w-full">
            <Breadcrumb breadcrumbItems={breadcrumbItems} />
            <div
              className={`flex gap-[24px] items-center ${mobileResolution ? "w-full" : ""}`}
            >
              <SelectOrganization mobileResolution={mobileResolution} />
              <SelectDepartment mobileResolution={mobileResolution} />
            </div>
          </div>
          <div
            className={`flex gap-[8px] items-center ${mobileResolution ? "ml-auto" : ""}`}
          >
            <UserActions
              user={user}
              mobileResolution={mobileResolution}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
