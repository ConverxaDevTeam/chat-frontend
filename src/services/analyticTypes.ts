export enum AnalyticType {
  TOTAL_USERS = 1,
  NEW_USERS = 2,
  RECURRING_USERS = 3,
  SESSIONS = 4,
  IA_MESSAGES = 5,
  HITL_MESSAGES = 6,
  TOTAL_MESSAGES = 7,
  AVG_IA_MESSAGES_PER_SESSION = 8,
  AVG_HITL_MESSAGES_PER_SESSION = 9,
  AVG_SESSIONS_PER_USER = 10,
  MESSAGES_BY_CHANNEL = 11,
  FUNCTION_CALLS = 12,
  FUNCTIONS_PER_SESSION = 13,
}

export enum StatisticsDisplayType {
  METRIC = 1,
  AREA = 2,
  BAR = 3,
}

export enum TimeRange {
  LAST_7_DAYS = "7d",
  LAST_30_DAYS = "30d",
  LAST_6_MONTHS = "6m",
  LAST_YEAR = "1y",
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
    id: AnalyticType.MESSAGES_BY_CHANNEL,
    label: "Mensajes por Canal",
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
];

export const timeRangeOptions = [
  { id: TimeRange.LAST_7_DAYS, label: "Últimos 7 días" },
  { id: TimeRange.LAST_30_DAYS, label: "Últimos 30 días" },
  { id: TimeRange.LAST_6_MONTHS, label: "Últimos 6 meses" },
  { id: TimeRange.LAST_YEAR, label: "Último año" },
];
