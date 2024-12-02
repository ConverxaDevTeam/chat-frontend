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

export const themeColors = [
  {
    id: 0,
    color: "#FF2F2C",
    name: "Red",
  },
  {
    id: 1,
    color: "#8D14E9",
    name: "Purple",
  },
  {
    id: 2,
    color: "#300970",
    name: "Indigo",
  },
  {
    id: 3,
    color: "#1700D1",
    name: "Blue",
  },
  {
    id: 4,
    color: "#252525",
    name: "Black",
  },
];
