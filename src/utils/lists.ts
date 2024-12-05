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

interface themeColor {
  id: number;
  bgColor: string;
  bgChat: string;
  bgUser: string;
  bgAssistant: string;
  name: string;
  textColor: string;
  textDate: string;
  buttonColor: string;
}

export const themeColors: themeColor[] = [
  {
    id: 0,
    bgColor: "#15ECDA",
    bgChat: "#F5F5F5",
    bgUser: "#ffffff",
    bgAssistant: "#b1f6f0",
    name: "SofiaChat",
    textColor: "#000000",
    textDate: "#969696",
    buttonColor: "#1accbd",
  },
  {
    id: 1,
    bgColor: "#8D14E9",
    bgChat: "#F5F5F5",
    bgUser: "#ffffff",
    bgAssistant: "#dfb8fd",
    name: "Purple",
    textColor: "#ffffff",
    textDate: "#61506d",
    buttonColor: "#bb97d6",
  },
  {
    id: 2,
    bgColor: "#300970",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Indigo",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
  {
    id: 3,
    bgColor: "#1700D1",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Blue",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
  {
    id: 4,
    bgColor: "#252525",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Black",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
];

interface ChatMessage {
  id: number;
  text: string;
  user: "assistant" | "user";
  created_at: string;
}

export const chatExample: ChatMessage[] = [
  {
    id: 1,
    text: "Hola, ¿en qué puedo ayudarte?",
    user: "assistant",
    created_at: "2022-01-01T12:00:00",
  },
  {
    id: 2,
    text: "Necesito ayuda con mi cuenta",
    user: "user",
    created_at: "2022-01-01T12:01:00",
  },
  {
    id: 3,
    text: "¿Qué necesitas saber?",
    user: "assistant",
    created_at: "2022-01-01T12:02:00",
  },
  {
    id: 4,
    text: "¿Cómo puedo cambiar mi contraseña?",
    user: "user",
    created_at: "2022-01-01T12:03:00",
  },
  {
    id: 5,
    text: "Puedes hacerlo desde la sección de configuración",
    user: "assistant",
    created_at: "2022-01-01T12:04:00",
  },
  {
    id: 6,
    text: "Gracias",
    user: "user",
    created_at: "2022-01-01T12:05:00",
  },
  {
    id: 7,
    text: "De nada, ¿hay algo más en lo que pueda ayudarte?",
    user: "assistant",
    created_at: "2022-01-01T12:06:00",
  },
];
