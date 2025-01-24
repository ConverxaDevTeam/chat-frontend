import { subDays } from "date-fns";
import { AnalyticType } from "./analyticTypes";

export interface StatisticEntry {
  type: AnalyticType;
  created_at: Date;
  label: string;
  value: number;
  color: string;
  icon?: string;
}

const CHANNEL_METADATA = {
  whatsapp: { color: "#25D366", icon: "whatsapp" },
  facebook: { color: "#1877F2", icon: "messenger" },
  web: { color: "#60A5FA", icon: "globe" },
} as const;

const ANALYTIC_METADATA: Record<
  AnalyticType,
  { label: string; color: string; icon?: string }
> = {
  [AnalyticType.TOTAL_USERS]: {
    label: "Total Usuarios",
    color: "#10B981",
  },
  [AnalyticType.NEW_USERS]: {
    label: "Nuevos Usuarios",
    color: "#10B981",
  },
  [AnalyticType.RECURRING_USERS]: {
    label: "Usuarios Recurrentes",
    color: "#10B981",
  },
  [AnalyticType.SESSIONS]: {
    label: "Sesiones",
    color: "#8B5CF6",
  },
  [AnalyticType.IA_MESSAGES]: {
    label: "Mensajes IA",
    color: "#15ECDA",
  },
  [AnalyticType.HITL_MESSAGES]: {
    label: "Mensajes HITL",
    color: "#001126",
  },
  [AnalyticType.TOTAL_MESSAGES]: {
    label: "Total Mensajes",
    color: "#60A5FA",
  },
  [AnalyticType.AVG_IA_MESSAGES_PER_SESSION]: {
    label: "Promedio Mensajes IA por Sesión",
    color: "#60A5FA",
  },
  [AnalyticType.AVG_HITL_MESSAGES_PER_SESSION]: {
    label: "Promedio Mensajes HITL por Sesión",
    color: "#60A5FA",
  },
  [AnalyticType.AVG_SESSIONS_PER_USER]: {
    label: "Promedio Sesiones por Usuario",
    color: "#8B5CF6",
  },
  [AnalyticType.MESSAGES_BY_WHATSAPP]: {
    label: "Mensajes por WhatsApp",
    ...CHANNEL_METADATA.whatsapp,
  },
  [AnalyticType.MESSAGES_BY_FACEBOOK]: {
    label: "Mensajes por Facebook",
    ...CHANNEL_METADATA.facebook,
  },
  [AnalyticType.MESSAGES_BY_WEB]: {
    label: "Mensajes por Web",
    ...CHANNEL_METADATA.web,
  },
  [AnalyticType.FUNCTION_CALLS]: {
    label: "Llamadas a Funciones",
    color: "#F59E0B",
  },
  [AnalyticType.FUNCTIONS_PER_SESSION]: {
    label: "Funciones por Sesión",
    color: "#F59E0B",
  },
};

// Genera datos genéricos para cualquier tipo
const generateData = (
  type: AnalyticType,
  days: number,
  baseValue: number,
  variance: number
): StatisticEntry[] => {
  const metadata = ANALYTIC_METADATA[type];
  const rangeMultiplier = days <= 7 ? 1 : days / 7;

  return Array.from({ length: days }).map((_, index) => ({
    type,
    created_at: subDays(new Date(), days - index - 1),
    label: metadata.label,
    value: Math.max(
      0,
      Math.floor(baseValue * rangeMultiplier + Math.random() * variance)
    ),
    color: metadata.color,
    icon: metadata.icon,
  }));
};

export const getMockData = (
  type: AnalyticType,
  days: number = 30
): StatisticEntry[] => {
  const config: Partial<
    Record<AnalyticType, { base: number; variance: number }>
  > = {
    [AnalyticType.TOTAL_USERS]: { base: 35, variance: 15 },
    [AnalyticType.NEW_USERS]: { base: 18, variance: 10 },
    [AnalyticType.RECURRING_USERS]: { base: 23, variance: 8 },
    [AnalyticType.SESSIONS]: { base: 267, variance: 80 },
    [AnalyticType.IA_MESSAGES]: { base: 897, variance: 350 },
    [AnalyticType.HITL_MESSAGES]: { base: 567, variance: 320 },
    [AnalyticType.TOTAL_MESSAGES]: { base: 1024, variance: 800 },
    [AnalyticType.AVG_IA_MESSAGES_PER_SESSION]: { base: 87, variance: 25 },
    [AnalyticType.AVG_HITL_MESSAGES_PER_SESSION]: { base: 245, variance: 50 },
    [AnalyticType.AVG_SESSIONS_PER_USER]: { base: 267, variance: 40 },
    [AnalyticType.MESSAGES_BY_WHATSAPP]: { base: 450, variance: 80 },
    [AnalyticType.MESSAGES_BY_FACEBOOK]: { base: 350, variance: 60 },
    [AnalyticType.MESSAGES_BY_WEB]: { base: 224, variance: 45 },
    [AnalyticType.FUNCTION_CALLS]: { base: 421, variance: 90 },
    [AnalyticType.FUNCTIONS_PER_SESSION]: { base: 3, variance: 2 },
  };

  const defaultConfig = { base: 0, variance: 0 };
  const { base, variance } = config[type] || defaultConfig;
  return generateData(type, days, base, variance);
};

// Función para obtener datos dentro de un rango de fechas
export const getDataInRange = (
  data: StatisticEntry[],
  startDate: Date,
  endDate: Date
): StatisticEntry[] => {
  return data.filter(
    entry => entry.created_at >= startDate && entry.created_at <= endDate
  );
};
