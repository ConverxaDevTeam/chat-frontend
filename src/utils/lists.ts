import { FaUsers } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { FaLayerGroup } from "react-icons/fa";

export const sidebarLinks = [
  {
    to: "/dashboard",
    text: "Dashboard",
    active: ["/", "/dashboard"],
    Icon: AiFillHome,
  },
];

export const sidebarAdminLinks = [
  {
    to: "/dashboard",
    text: "Dashboard",
    active: ["/", "/dashboard"],
    Icon: AiFillHome,
  },
  {
    to: "/users",
    text: "Usuarios",
    active: ["/users"],
    Icon: FaUsers,
  },
  {
    to: "/organizations",
    text: "Organizaciones",
    active: ["/organizations"],
    Icon: FaLayerGroup,
  },
];