import SelectDepartment from "./SelectDepartment";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getNotifications } from "@services/notifications.service";
import { Fragment, useState } from "react";
import ContextMenu from "@components/ContextMenu";
import {
  Notification,
  NotificationType,
} from "@interfaces/notification.interface";
import SelectOrganization from "./SelectOrganization";
import { formatDateWithWeekday } from "@utils/format";

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

const OptionTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="flex py-4 items-center gap-[16px] self-stretch">
      {["Todos", "Sistema", "Usuario"].map(tab => (
        <button
          key={tab}
          className={`text-xs p-[8px] rounded-[4px]  ${activeTab === tab ? "font-medium text-[#001130] bg-sofia-darkBlue" : "text-gray-500"}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const NotificationsHeader = ({
  activeTab,
  setActiveTab,
  onClose,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
}) => (
  <Fragment>
    <div className="flex justify-between items-center self-stretch">
      <span className="text-[#001130] text-sm font-bold leading-6">
        Notificaciones
      </span>
      <button onClick={onClose} className="text-base">
        &times;
      </button>
    </div>
    <OptionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
  </Fragment>
);

const NotificationsFooter = ({
  onMarkAllAsRead,
}: {
  onMarkAllAsRead: () => void;
}) => (
  <div className="flex justify-between items-center py-[15px]">
    <button
      onClick={onMarkAllAsRead}
      className="text-sofia-superDark text-xs font-normal underline underline-offset-auto underline-from-font hover:underline"
    >
      Marcar todas como leídas
    </button>
    <button className="text-sofia-blancoPuro text-[12px] font-bold leading-6 bg-sofia-superDark hover:bg-[#E5E7EB] py-2 px-4 rounded-lg">
      Ver todas
    </button>
  </div>
);

const NotificationItem = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => (
  <div
    key={notification.id}
    onClick={() => {
      if (notification.link) window.location.href = notification.link;
      onClose();
    }}
    className={`flex items-center gap-4 px-4 py-[16px] cursor-pointer ${
      notification.isRead ? "" : "bg-sofia-celeste"
    }`}
  >
    <div className="relative">
      <div className="rounded-full bg-sofia-darkLight w-[40px] h-[40px] flex items-center justify-center">
        <img src="/icon.svg" alt="notification" />
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <div className="text-xs font-normal text-[#001130] line-clamp-2 w-[239px]">
          {notification.title}
        </div>
        {!notification.isRead && (
          <div className="w-[48px] flex justify-end items-start">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          </div>
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span className="text-[#A6A8AB] text-right text-[8px] font-normal leading-none">
          {new Date(notification.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
        <span className="text-[#A6A8AB] text-right text-[8px] font-normal leading-none">
          {formatDateWithWeekday(notification.created_at)}
        </span>
      </div>
    </div>
  </div>
);

const NotificationsMenu = ({
  contextMenu,
  setContextMenu,
}: {
  contextMenu: { x: number; y: number; notifications: Notification[] } | null;
  setContextMenu: (
    contextMenu: { x: number; y: number; notifications: Notification[] } | null
  ) => void;
}) => {
  const [contextMenuState, setContextMenuState] = useState<{
    x: number;
    y: number;
    notifications: Notification[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState("Todos");

  const handleBellClick = async (event: React.MouseEvent) => {
    const notifications = await getNotifications();
    const { clientX, clientY } = event;
    setContextMenuState({ x: clientX, y: clientY, notifications });
    setContextMenu({ x: clientX, y: clientY, notifications });
  };

  const filteredNotifications =
    (contextMenu || contextMenuState)?.notifications.filter(
      notification =>
        activeTab === "Todos" ||
        (activeTab === "Sistema" &&
          notification.type === NotificationType.SYSTEM) ||
        (activeTab === "Usuario" && notification.type === NotificationType.USER)
    ) || [];

  const markAllAsRead = () => {
    // Implementar la lógica para marcar todas las notificaciones como leídas
  };

  return (
    <>
      <img
        src="/mvp/bell.svg"
        alt="Bell"
        className="w-5 h-5"
        onClick={handleBellClick}
      />
      {(contextMenu || contextMenuState) && (
        <ContextMenu
          x={(contextMenu || contextMenuState)?.x ?? 0}
          y={(contextMenu || contextMenuState)?.y ?? 0}
          bodyClassname="max-h-[500px] overflow-y-auto -mx-4"
          onClose={() => {
            setContextMenuState(null);
            setContextMenu(null);
          }}
          header={
            <NotificationsHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={() => {
                setContextMenuState(null);
                setContextMenu(null);
              }}
            />
          }
          footer={<NotificationsFooter onMarkAllAsRead={markAllAsRead} />}
        >
          {filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={() => {
                setContextMenuState(null);
                setContextMenu(null);
              }}
            />
          ))}
        </ContextMenu>
      )}
    </>
  );
};

const UserActions = ({
  user,
  mobileResolution,
  contextMenu,
  setContextMenu,
}: {
  user: { email: string } | null;
  mobileResolution: boolean;
  contextMenu: { x: number; y: number; notifications: Notification[] } | null;
  setContextMenu: (
    contextMenu: { x: number; y: number; notifications: Notification[] } | null
  ) => void;
}) => {
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
        <NotificationsMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
        />
        <img src="/mvp/settings.svg" alt="Settings" className="w-5 h-5" />
        <img src="/mvp/spanish.svg" alt="Language" className="w-5 h-5" />
        <img
          src="/mvp/chevron-down.svg"
          alt="Chevron down"
          className="w-5 h-5"
        />
      </div>
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
