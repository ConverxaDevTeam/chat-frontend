import SelectDepartment from "./SelectDepartment";
import { RootState } from "@store";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@services/notifications.service";
import { Fragment, useState, useRef, useEffect } from "react";
import {
  Notification,
  NotificationType,
} from "@interfaces/notification.interface";
import SelectOrganization from "./SelectOrganization";
import { formatDateWithWeekday } from "@utils/format";
import {
  setNotificationCount,
  decrementNotificationCount,
} from "@/store/reducers/notifications";

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
  <div className="flex justify-end items-center py-[15px]">
    <button
      onClick={onMarkAllAsRead}
      className="text-sofia-superDark text-xs font-normal underline underline-offset-auto underline-from-font hover:underline"
    >
      Marcar todas como leídas
    </button>
  </div>
);

const NotificationItem = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const handleMarkNotificationAsRead = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
  };

  const handleClick = async () => {
    if (!notification.isRead && notification.type === NotificationType.USER) {
      await handleMarkNotificationAsRead(notification.id);
      dispatch(decrementNotificationCount());
    }
    if (notification.link) window.location.href = notification.link;
    onClose();
  };

  return (
    <div
      key={notification.id}
      onClick={handleClick}
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
};

const NotificationsMenu = ({
  contextMenu,
  setContextMenu,
}: {
  contextMenu: { notifications: Notification[] } | null;
  setContextMenu: (
    contextMenu: { notifications: Notification[] } | null
  ) => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [contextMenuState, setContextMenuState] = useState<{
    notifications: Notification[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState("Todos");
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const notificationCount = useSelector(
    (state: RootState) => state.notifications.count
  );
  const dispatch = useDispatch();

  const handleBellClick = async () => {
    if (!selectOrganizationId) return;
    const notifications = await getNotifications(selectOrganizationId);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    dispatch(setNotificationCount(unreadCount));
    setContextMenuState({ notifications });
    setContextMenu({ notifications });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenuState(null);
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setContextMenu]);

  const filteredNotifications =
    (contextMenu || contextMenuState)?.notifications.filter(
      notification =>
        activeTab === "Todos" ||
        (activeTab === "Sistema" &&
          notification.type === NotificationType.SYSTEM) ||
        (activeTab === "Usuario" && notification.type === NotificationType.USER)
    ) || [];

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setContextMenuState(null);
      setContextMenu(null);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="relative w-5 h-5">
      <div className="flex items-center">
        <img
          src="/mvp/bell.svg"
          alt="Bell"
            onClick={handleBellClick}
        />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-sofia-error text-white text-[10px] rounded-full w-[12px] h-[12px] flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>
      {(contextMenu || contextMenuState) && (
        <div
          ref={menuRef}
          className="fixed right-4 top-[60px] w-[400px] bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-10"
        >
          <NotificationsHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={() => {
              setContextMenuState(null);
              setContextMenu(null);
            }}
          />
          <div className="max-h-[500px] overflow-y-auto -mx-4">
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
          </div>
          <NotificationsFooter onMarkAllAsRead={markAllAsRead} />
        </div>
      )}
    </div>
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
  contextMenu: { notifications: Notification[] } | null;
  setContextMenu: (
    contextMenu: { notifications: Notification[] } | null
  ) => void;
}) => {
  return (
    <div
      className={`flex gap-[8px] items-center ${mobileResolution ? "self-end" : ""}`}
    >
      <p
        className={`text-sofia-superDark font-normal text-[14px] ${
          mobileResolution ? "" : "mr-3"
        }`}
      >
        {user?.email}
      </p>
      <div
        className={`
          bg-[#F1F5F9] rounded-[8px] shadow-[1px_1px_2px_0px_#B8CCE0,-1px_-1px_2px_0px_#FFFFFF,1px_1px_2px_0px_#B8CCE0_inset,-1px_-1px_2px_0px_#FFFFFF_inset] relative flex justify-between items-center gap-2 p-3 cursor-pointer h-[36px] ${
          mobileResolution ? "w-full" : "w-[148px]"
        }`}
      >
        <NotificationsMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
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
    notifications: Notification[];
  } | null>(null);

  return (
    <div
      className={`w-full ${mobileResolution ? "mt-[10px]" : "mt-[20px]"} h-auto`}
    >
      <div
        style={{
          width: "100%",
        }}
        className={`flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between items-start lg:items-center`}
      >
        <div className="flex flex-col md:flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
          <div
            className={`${mobileResolution ? "" : "block"} order-1 lg:order-none`}
          >
            <Breadcrumb breadcrumbItems={breadcrumbItems} />
          </div>
          <div
            className={`flex gap-[24px] items-center w-full md:w-auto order-1 lg:order-none`}
          >
            <SelectOrganization mobileResolution={mobileResolution} />
            <SelectDepartment mobileResolution={mobileResolution} />
          </div>
        </div>
        <div
          className={`flex gap-[8px] items-center ${mobileResolution ? "ml-auto " : ""}`}
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
  );
};

export default Navbar;
