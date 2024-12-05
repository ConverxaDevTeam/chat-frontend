import { FaUsers } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { FaLayerGroup } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";
import { IConversation } from "@pages/Workspace/components/ChatPreview";

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
  {
    id: 5,
    bgColor: "#252525",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Black",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
  {
    id: 6,
    bgColor: "#252525",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Black",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
  {
    id: 7,
    bgColor: "#252525",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Black",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
  {
    id: 8,
    bgColor: "#252525",
    bgChat: "#F5F5F5",
    bgUser: "#82c0cf",
    bgAssistant: "#8D14E9",
    name: "Black",
    textColor: "#ffffff",
    textDate: "#BFBFBF",
    buttonColor: "#15ECDA",
  },
  {
    id: 9,
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

export const conversationsExample: IConversation[] = [
  {
    id: 1,
    created_at: "2024-12-05 03:35:36.824",
    messages: [
      {
        id: 1,
        text: "Hola, ¿cómo estás?",
        type: "agent",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 2,
        text: "Hola, bien, gracias",
        type: "user",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 3,
        text: "¿En qué puedo ayudarte?",
        type: "agent",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 4,
        text: "Quiero saber más sobre tu producto",
        type: "user",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 5,
        text: "Claro, ¿qué te gustaría saber?",
        type: "agent",
        created_at: "2024-12-05 03:35:36.824",
      },
    ],
  },
  {
    id: 2,
    created_at: "2024-12-05 03:35:36.824",
    messages: [
      {
        id: 1,
        text: "Hola, ¿cómo estás?",
        type: "agent",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 2,
        text: "Hola, bien, gracias",
        type: "user",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 3,
        text: "¿En qué puedo ayudarte?",
        type: "agent",
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 4,
        text: "Quiero saber más sobre tu producto",
        type: "user",
        created_at: "2024-12-05 03:35:36.824",
      },
    ],
  },
];
