import { FaUsers } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { FaLayerGroup } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";

export const sidebarLinks = [
  {
    to: "/dashboard",
    text: "Dashboard",
    active: ["/", "/dashboard"],
    Icon: AiFillHome,
  },
  {
    to: "/workspace",
    text: "Espacios de trabajo",
    active: ["/workspace"],
    Icon: BsPersonWorkspace,
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
