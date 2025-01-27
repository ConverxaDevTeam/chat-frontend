export enum AnalyticType {
  SESSIONS = "SESSIONS",
  TOTAL_MESSAGES = "TOTAL_MESSAGES",
  FUNCTION_CALLS = "FUNCTION_CALLS",
  MESSAGES_BY_WHATSAPP = "MESSAGES_BY_WHATSAPP",
  MESSAGES_BY_FACEBOOK = "MESSAGES_BY_FACEBOOK",
  MESSAGES_BY_WEB = "MESSAGES_BY_WEB",
  RECURRING_USERS = "RECURRING_USERS",
  TOTAL_USERS = "TOTAL_USERS",
  NEW_USERS = "NEW_USERS",
  IA_MESSAGES = "IA_MESSAGES",
  HITL_MESSAGES = "HITL_MESSAGES",
  AVG_IA_MESSAGES_PER_SESSION = "AVG_IA_MESSAGES_PER_SESSION",
  AVG_HITL_MESSAGES_PER_SESSION = "AVG_HITL_MESSAGES_PER_SESSION",
  AVG_SESSIONS_PER_USER = "AVG_SESSIONS_PER_USER",
  FUNCTIONS_PER_SESSION = "FUNCTIONS_PER_SESSION",
}

export enum StatisticsDisplayType {
  METRIC = 1,
  AREA = 2,
  BAR = 3,
  PIE = 4,
}

export enum TimeRange {
  LAST_DAY = "1d", // Último día
  LAST_7_DAYS = "7d", // Últimos 7 días
  LAST_30_DAYS = "30d", // Últimos 30 días
  LAST_90_DAYS = "90d", // Últimos 90 días
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
    id: AnalyticType.AVG_IA_MESSAGES_PER_SESSION,
    label: "Avg. Mensajes IA por Sesion",
  },
  {
    id: AnalyticType.AVG_HITL_MESSAGES_PER_SESSION,
    label: "Avg Mensajes HITL por Sesion",
  },
  {
    id: AnalyticType.AVG_SESSIONS_PER_USER,
    label: "Avg Sesiones por Usuario",
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
  [TimeRange.LAST_DAY]: "Último día",
  [TimeRange.LAST_7_DAYS]: "Últimos 7 días",
  [TimeRange.LAST_30_DAYS]: "Últimos 30 días",
  [TimeRange.LAST_90_DAYS]: "Últimos 90 días",
  [TimeRange.LAST_6_MONTHS]: "Últimos 6 meses",
  [TimeRange.LAST_YEAR]: "Último año",
};

export const timeRangeOptions = [
  { id: TimeRange.LAST_7_DAYS, label: timeRangeLabels[TimeRange.LAST_7_DAYS] },
  {
    id: TimeRange.LAST_30_DAYS,
    label: timeRangeLabels[TimeRange.LAST_30_DAYS],
  },
  {
    id: TimeRange.LAST_90_DAYS,
    label: timeRangeLabels[TimeRange.LAST_90_DAYS],
  },
  {
    id: TimeRange.LAST_6_MONTHS,
    label: timeRangeLabels[TimeRange.LAST_6_MONTHS],
  },
  { id: TimeRange.LAST_YEAR, label: timeRangeLabels[TimeRange.LAST_YEAR] },
];
