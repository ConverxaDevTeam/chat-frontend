import { RootState } from "@store";
import { OrganizationRoleType } from "@utils/interfaces";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InfoTooltip from "@components/common/InfoTooltip";

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
    link.active.some(path => {
      if (path === '/') {
        return currentPath === '/';
      }
      return currentPath === path || (path !== '/' && currentPath.startsWith(path));
    });
  if (
    !actualRoles ||
    (roles.length > 0 && !roles.some(role => actualRoles!.includes(role)))
  ) {
    return null;
  }

  return (
    <li
      className={`relative flex h-[35px] items-center gap-[16px] ${active
          ? "bg-sofia-superDark rounded-[4px] text-sofia-blancoPuro"
          : "text-app-gray hover:bg-[#F6F6F6] rounded"
        } ${sidebarMinimized || mobileResolution ? "w-full justify-center" : "w-full pl-[12px]"}`}
    >
      {sidebarMinimized || mobileResolution ? (
        <div className="group relative flex justify-center items-center w-full">
          <InfoTooltip
            text={link.text}                       
            position="right"                       
            width="auto"                           
            iconSrc={`/mvp/${link.img}`}           
            onClick={() => navigate(linkUrl)}
            active={active}                       
          />
        </div>
      ) : (
        <>
          <img
            className={`w-6 h-6 fill-current z-10 ${active ? "brightness-0 invert" : "cursor-pointer"}`}
            src={`/mvp/${link.img}`}
            onClick={() => {
              navigate(linkUrl);
            }}
            alt={link.text}
          />
          <Link
            to={linkUrl}
            className={`z-10 font-normal transition-all duration-300 ease-in-out ${active
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
