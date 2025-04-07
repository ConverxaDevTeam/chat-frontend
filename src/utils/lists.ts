import {
  IConversation,
  MessageFormatType,
  MessageType,
  OrganizationRoleType,
} from "./interfaces";

export const sidebarLinks = [
  {
    to: "/dashboard",
    text: "Dashboard",
    active: ["/", "/dashboard"],
    img: "house.svg",
    role: [
      OrganizationRoleType.OWNER,
      OrganizationRoleType.ADMIN,
      OrganizationRoleType.USER,
    ],
  },
  {
    to: "/workspace",
    text: "Espacios de trabajo",
    active: ["/workspace"],
    img: "workflow.svg",
    role: [
      OrganizationRoleType.OWNER,
      OrganizationRoleType.ADMIN,
      OrganizationRoleType.USER,
    ],
  },
  {
    to: "/conversations",
    text: "Conversaciones",
    active: ["/conversations"],
    img: "chat-dots.svg",
    role: [
      OrganizationRoleType.OWNER,
      OrganizationRoleType.ADMIN,
      OrganizationRoleType.USER,
    ],
  },
  {
    to: "/departments",
    text: "Departamentos",
    active: ["/departments"],
    img: "hotel.svg",
    role: [OrganizationRoleType.OWNER, OrganizationRoleType.ADMIN],
  },
  {
    to: "/users",
    text: "Usuarios",
    active: ["/users"],
    img: "share-android.svg",
    role: [OrganizationRoleType.OWNER],
  },
  {
    to: "/templateUsage",
    text: "Usar Templates",
    active: ["/templateUsage"],
    img: "file-code.svg",
    role: [
      OrganizationRoleType.OWNER,
      OrganizationRoleType.ADMIN,
      OrganizationRoleType.USER,
    ],
  },
];

export const sidebarAdminLinks = [
  {
    to: "/dashboard",
    text: "Dashboard",
    active: ["/", "/dashboard"],
    img: "house.svg",
  },
  {
    to: "/templateCreation",
    text: "Function Templates",
    active: ["/templateCreation"],
    img: "file-code.svg",
    role: [OrganizationRoleType.ADMIN],
  },
  {
    to: "/users",
    text: "Usuarios",
    active: ["/users"],
    img: "house.svg",
  },
  {
    to: "/organizations",
    text: "Organizaciones",
    active: ["/organizations"],
    roles: [OrganizationRoleType.ING_PREVENTA],
    img: "house.svg",
  },
];

interface themeColor {
  id: number;
  name: string;
  bg_color: string;
  text_title: string;
  bg_chat: string;
  text_color: string;
  bg_assistant: string;
  bg_user: string;
  button_color: string;
  button_text: string;
  text_date: string;
}

export const themeColors: themeColor[] = [
  {
    id: 0,
    name: "sofia",
    bg_color: "#15ECDA",
    text_title: "#000000",
    bg_chat: "#F5F5F5",
    text_color: "#000000",
    bg_assistant: "#b1f6f0",
    bg_user: "#ffffff",
    button_color: "#15ECDA",
    button_text: "#ffffff",
    text_date: "#969696",
  },
  {
    id: 1,
    name: "vibrant_blue",
    bg_color: "#4A90E2",
    text_title: "#FFFFFF",
    bg_chat: "#D9E8F5",
    text_color: "#333333",
    bg_assistant: "#72C2F1",
    bg_user: "#FFFFFF",
    button_color: "#4A90E2",
    button_text: "#FFFFFF",
    text_date: "#A5B8C2",
  },
  {
    id: 2,
    name: "purple_wave",
    bg_color: "#9B59B6",
    text_title: "#FFFFFF",
    bg_chat: "#E5D1F5",
    text_color: "#333333",
    bg_assistant: "#B57AEB",
    bg_user: "#FFFFFF",
    button_color: "#9B59B6",
    button_text: "#FFFFFF",
    text_date: "#D3A3D3",
  },
  {
    id: 3,
    name: "sunny_orange",
    bg_color: "#F39C12",
    text_title: "#FFFFFF",
    bg_chat: "#FDE8C9",
    text_color: "#333333",
    bg_assistant: "#F7D28A",
    bg_user: "#FFFFFF",
    button_color: "#F39C12",
    button_text: "#FFFFFF",
    text_date: "#D79B5B",
  },
  {
    id: 4,
    name: "calm_pink",
    bg_color: "#F8A5C2",
    text_title: "#FFFFFF",
    bg_chat: "#FBE3F1",
    text_color: "#333333",
    bg_assistant: "#F1C0D3",
    bg_user: "#FFFFFF",
    button_color: "#F8A5C2",
    button_text: "#FFFFFF",
    text_date: "#D1A5B3",
  },
  {
    id: 5,
    name: "serene_teal",
    bg_color: "#1ABC9C",
    text_title: "#FFFFFF",
    bg_chat: "#D9F2F0",
    text_color: "#333333",
    bg_assistant: "#76D7C4",
    bg_user: "#FFFFFF",
    button_color: "#1ABC9C",
    button_text: "#FFFFFF",
    text_date: "#A3BDB5",
  },
  {
    id: 6,
    name: "bright_yellow",
    bg_color: "#F1C40F",
    text_title: "#FFFFFF",
    bg_chat: "#F9E2A2",
    text_color: "#333333",
    bg_assistant: "#F8D75C",
    bg_user: "#FFFFFF",
    button_color: "#F1C40F",
    button_text: "#FFFFFF",
    text_date: "#D0A928",
  },
  {
    id: 7,
    name: "cool_gray",
    bg_color: "#95A5A6",
    text_title: "#FFFFFF",
    bg_chat: "#E2E5E5",
    text_color: "#333333",
    bg_assistant: "#BCC6C6",
    bg_user: "#FFFFFF",
    button_color: "#95A5A6",
    button_text: "#FFFFFF",
    text_date: "#A4B0B0",
  },
  {
    id: 8,
    name: "seafoam_green",
    bg_color: "#2ECC71",
    text_title: "#FFFFFF",
    bg_chat: "#D1F5D1",
    text_color: "#333333",
    bg_assistant: "#80E5A3",
    bg_user: "#FFFFFF",
    button_color: "#2ECC71",
    button_text: "#FFFFFF",
    text_date: "#A3C9A3",
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
        type: MessageType.AGENT,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 2,
        text: "Hola, bien, gracias",
        type: MessageType.USER,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 3,
        text: "¿En qué puedo ayudarte?",
        type: MessageType.AGENT,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 4,
        text: "Quiero saber más sobre tu producto",
        type: MessageType.USER,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 5,
        text: "Claro, ¿qué te gustaría saber?",
        type: MessageType.AGENT,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
    ],
    user: {
      id: 0,
    },
  },
  {
    id: 2,
    created_at: "2024-12-05 03:35:36.824",
    messages: [
      {
        id: 1,
        text: "Hola, ¿cómo estás?",
        type: MessageType.AGENT,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 2,
        text: "Hola, bien, gracias",
        type: MessageType.USER,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 3,
        text: "¿En qué puedo ayudarte?",
        type: MessageType.AGENT,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
      {
        id: 4,
        text: "Quiero saber más sobre tu producto",
        type: MessageType.USER,
        format: MessageFormatType.TEXT,
        audio: null,
        created_at: "2024-12-05 03:35:36.824",
      },
    ],
    user: {
      id: 0,
    },
  },
];
