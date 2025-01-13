import { RootState } from "@store";
import { OrganizationRoleType } from "@utils/interfaces";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ItemSidebarProps {
  link: {
    to: string;
    text: string;
    active: string[];
    img: string;
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
    .filter(org => org.organization.id === selectOrganizationId)
    .map(org => org.role);

  const active = currentPath === link.to || link.active.includes(currentPath);
  if (
    !actualRoles ||
    (roles.length > 0 && !roles.some(role => actualRoles!.includes(role)))
  ) {
    return null;
  }

  return (
    <li
      className={`relative flex h-[35px] items-center gap-[16px] ${
        active ? "bg-sofia-electricGreen" : "text-app-gray"
      } ${active && (sidebarMinimized || mobileResolution) ? "w-full justify-center" : "w-full pl-[12px]"}`}
    >
      <img
        className={`w-6 h-6 fill-current z-10 ${active ? "" : "cursor-pointer"}`}
        src={`/mvp/${link.img}`}
        onClick={() => {
          navigate(link.to);
        }}
        alt="Logo"
      />
      {!(sidebarMinimized || mobileResolution) && (
        <Link
          to={link.to}
          className={`z-10 font-normal text-[#001126] transition-all duration-300 ease-in-out ${
            active ? "cursor-default" : "cursor-pointer"
          }`}
        >
          {link.text}
        </Link>
      )}
    </li>
  );
};

export default ItemSidebar;
