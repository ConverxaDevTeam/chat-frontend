import { RootState } from "@store";
import { OrganizationRoleType } from "@utils/interfaces";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ItemSidebarProps {
  link: {
    to: string | ((orgId: number) => string);
    text: string;
    active: string[];
    img: string;
    imgWhite?: string;
    isDynamic?: boolean;
  };
  sidebarMinimized: boolean;
  mobileResolution: boolean;
  role?: OrganizationRoleType[];
}

const ItemSidebar = ({
  link,
  sidebarMinimized,
  mobileResolution,
  role: roles = [],
}: ItemSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { selectOrganizationId, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  const actualRoles = myOrganizations
    .filter(org => org.organization?.id === selectOrganizationId)
    .map(org => org.role);

  const linkUrl =
    link.isDynamic && typeof link.to === "function" && selectOrganizationId
      ? link.to(selectOrganizationId)
      : typeof link.to === "string"
        ? link.to
        : "";

  const active =
    currentPath === linkUrl ||
    link.active.some(path => currentPath.includes(path));
  if (
    !actualRoles ||
    (roles.length > 0 && !roles.some(role => actualRoles!.includes(role)))
  ) {
    return null;
  }

  return (
    <li
      className={`relative flex h-[35px] items-center gap-[16px] ${
        active
          ? "bg-sofia-superDark rounded-[4px] text-sofia-blancoPuro"
          : "text-app-gray"
      } ${sidebarMinimized || mobileResolution ? "w-full justify-center" : "w-full pl-[12px]"}`}
    >
      {sidebarMinimized || mobileResolution ? (
        <div className="group relative flex justify-center items-center w-full">
          <img
            className={`w-6 h-6 fill-current z-10 ${active ? "" : "cursor-pointer"}`}
            src={active ? `/mvp/${link.imgWhite}` : `/mvp/${link.img}`}
            onClick={() => {
              navigate(linkUrl);
            }}
            alt={link.text}
          />
          <div
            className={`
              absolute z-50 left-full group-hover:flex hidden
              bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded
              font-[400] whitespace-nowrap tracking-[0.17px] leading-[143%] text-left
              shadow-md items-center pointer-events-none
            `}
            style={{
              marginLeft: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {link.text}
          </div>
        </div>
      ) : (
        <>
          <img
            className={`w-6 h-6 fill-current z-10 ${active ? "" : "cursor-pointer"}`}
            src={active ? `/mvp/${link.imgWhite}` : `/mvp/${link.img}`}
            onClick={() => {
              navigate(linkUrl);
            }}
            alt={link.text}
          />
          <Link
            to={linkUrl}
            className={`z-10 font-normal transition-all duration-300 ease-in-out ${
              active
                ? "cursor-default text-sofia-blancoPuro"
                : "cursor-pointer text-[#001126]"
            }`}
          >
            {link.text}
          </Link>
        </>
      )}
    </li>
  );
};

export default ItemSidebar;
