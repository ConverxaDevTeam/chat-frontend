export enum AnalyticType {
  TOTAL_USERS = "TOTAL_USERS",
  NEW_USERS = "NEW_USERS",
  MESSAGES_BY_WHATSAPP = "MESSAGES_BY_WHATSAPP",
  MESSAGES_BY_FACEBOOK = "MESSAGES_BY_FACEBOOK",
  MESSAGES_BY_WEB = "MESSAGES_BY_WEB",
  TOTAL_MESSAGES = "TOTAL_MESSAGES",
  IA_MESSAGES = "IA_MESSAGES",
  HITL_MESSAGES = "HITL_MESSAGES",
  FUNCTION_CALLS = "FUNCTION_CALLS",
  RECURRING_USERS = "RECURRING_USERS",
  SESSIONS = "SESSIONS",
  IA_MESSAGES_PER_SESSION = "IA_MESSAGES_PER_SESSION",
  HITL_MESSAGES_PER_SESSION = "HITL_MESSAGES_PER_SESSION",
  SESSIONS_PER_USER = "SESSIONS_PER_USER",
  FUNCTIONS_PER_SESSION = "FUNCTIONS_PER_SESSION",
}

export enum AnalyticDescription {
  TOTAL_USERS = "Usuarios que enviaron mensajes por día",
  NEW_USERS = "Usuarios creados por día",
  MESSAGES_BY_WHATSAPP = "Mensajes enviados por WhatsApp por día",
  MESSAGES_BY_FACEBOOK = "Mensajes enviados por Facebook por día",
  MESSAGES_BY_WEB = "Mensajes enviados por Web por día",
  TOTAL_MESSAGES = "Total de mensajes enviados por día",
  IA_MESSAGES = "Mensajes enviados por la IA por día",
  HITL_MESSAGES = "Mensajes enviados por agentes humanos por día",
  FUNCTION_CALLS = "Llamadas a funciones realizadas por día",
  RECURRING_USERS = "Usuarios con sesiones antes del período y con mensajes por día",
  SESSIONS = "Sesiones de chat creadas por día",
  IA_MESSAGES_PER_SESSION = "Promedio de mensajes de IA por sesión por día",
  HITL_MESSAGES_PER_SESSION = "Promedio de mensajes de agentes humanos por sesión por día",
  SESSIONS_PER_USER = "Promedio de sesiones por usuario por día",
  FUNCTIONS_PER_SESSION = "Promedio de llamadas a funciones por sesión por día",
}

export enum StatisticsDisplayType {
  PIE = "PIE",
  BAR = "BAR",
  AREA = "AREA",
  METRIC = "METRIC",
}

export enum TimeRange {
  LAST_7_DAYS = "7d", // Últimos 7 días
  LAST_30_DAYS = "30d", // Últimos 30 días
  LAST_6_MONTHS = "180d", // Últimos 6 meses
  LAST_YEAR = "365d", // Último año
}

export interface AnalyticOption {
  id: AnalyticType;
  label: string;
}

export const analyticOptions: AnalyticOption[] = [
  {
    id: AnalyticType.TOTAL_USERS,
    label: "Total Usuarios",
  },
  {
    id: AnalyticType.NEW_USERS,
    label: "Nuevos Usuarios",
  },
  {
    id: AnalyticType.RECURRING_USERS,
    label: "Usuarios recurrentes",
  },
  {
    id: AnalyticType.SESSIONS,
    label: "Sesiones, 30 minutos sin mensaje",
  },
  {
    id: AnalyticType.IA_MESSAGES,
    label: "Mensajes por IA",
  },
  {
    id: AnalyticType.HITL_MESSAGES,
    label: "Mensajes por HITL",
  },
  {
    id: AnalyticType.TOTAL_MESSAGES,
    label: "Total de Mensajes",
  },
  {
    id: AnalyticType.IA_MESSAGES_PER_SESSION,
    label: "Mensajes IA por Sesion",
  },
  {
    id: AnalyticType.HITL_MESSAGES_PER_SESSION,
    label: "Mensajes HITL por Sesion",
  },
  {
    id: AnalyticType.SESSIONS_PER_USER,
    label: "Sesiones por Usuario",
  },
  {
    id: AnalyticType.MESSAGES_BY_WHATSAPP,
    label: "Mensajes por WhatsApp",
  },
  {
    id: AnalyticType.MESSAGES_BY_FACEBOOK,
    label: "Mensajes por Facebook",
  },
  {
    id: AnalyticType.MESSAGES_BY_WEB,
    label: "Mensajes por Web",
  },
  {
    id: AnalyticType.FUNCTION_CALLS,
    label: "Cant. Llamadas a Funcion",
  },
  {
    id: AnalyticType.FUNCTIONS_PER_SESSION,
    label: "Funciones usadas por Sesion",
  },
];

export const displayTypeOptions = [
  { id: StatisticsDisplayType.METRIC, label: "Metrica" },
  { id: StatisticsDisplayType.AREA, label: "Area" },
  { id: StatisticsDisplayType.BAR, label: "Barras" },
  { id: StatisticsDisplayType.PIE, label: "Pastel" },
];

export const timeRangeLabels: Record<TimeRange, string> = {
  [TimeRange.LAST_7_DAYS]: "Últimos 7 días",
  [TimeRange.LAST_30_DAYS]: "Últimos 30 días",
  [TimeRange.LAST_6_MONTHS]: "Últimos 6 meses",
  [TimeRange.LAST_YEAR]: "Último año",
};

export const timeRangeOptions = [
  {
    id: TimeRange.LAST_7_DAYS,
    label: timeRangeLabels[TimeRange.LAST_7_DAYS],
    icon: "chevron-left.svg",
  },
  {
    id: TimeRange.LAST_30_DAYS,
    label: timeRangeLabels[TimeRange.LAST_30_DAYS],
    icon: "chevrons.svg",
  },
  {
    id: TimeRange.LAST_6_MONTHS,
    label: timeRangeLabels[TimeRange.LAST_6_MONTHS],
    icon: "calendar.svg",
  },
  {
    id: TimeRange.LAST_YEAR,
    label: timeRangeLabels[TimeRange.LAST_YEAR],
    icon: "calendar-days.svg",
  },
];
