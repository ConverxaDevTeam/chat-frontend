import {
  IconCall,
  IconCampaign,
  IconConversational,
  IconHistory,
  IconHome,
  IconUsers,
} from "@utils/svgs";
import { IoIosSettings } from "react-icons/io";
// import { MdWebhook } from "react-icons/md";
import { ROLE } from "@utils/interfaces";

const sidebarLinks = [
  {
    to: "/dashboard",
    text: "Dashboard",
    active: ["/", "/dashboard"],
    Icon: IconHome,
    roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.USER],
  },
  {
    to: "/call",
    text: "Test Call IA",
    active: ["/call"],
    Icon: IconCall,
    roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.USER],
  },
  {
    to: "/history",
    text: "Historial",
    active: ["/history"],
    Icon: IconHistory,
    roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.USER],
  },
  {
    to: "/conversationals",
    text: "Conversaciones",
    active: ["/conversationals"],
    Icon: IconConversational,
    roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.USER],
  },
  {
    to: "/campaigns",
    text: "Campañas",
    active: ["/campaigns"],
    Icon: IconCampaign,
    roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.USER],
  },
  {
    to: "/users",
    text: "Usuarios",
    active: ["/users"],
    Icon: IconUsers,
    roles: [ROLE.OWNER, ROLE.ADMIN],
  },
  {
    to: "/configuration",
    text: "Configuración",
    active: ["/configuration"],
    Icon: IoIosSettings,
    roles: [ROLE.OWNER],
  },
  // {
  //   to: "/webhooks",
  //   text: "Webhooks",
  //   active: ["/webhooks"],
  //   Icon: MdWebhook,
  //   roles: [ROLE.OWNER, ROLE.ADMIN],
  // },
];

export default sidebarLinks;
