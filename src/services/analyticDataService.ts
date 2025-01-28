import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "./analyticTypes";
import { StatisticEntry } from "./mockData";
import { startOfDay, subDays } from "date-fns";
import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@config/config";

const CHANNEL_METADATA = {
  whatsapp: { color: "#25D366", icon: "whatsapp" },
  facebook: { color: "#1877F2", icon: "messenger" },
  web: { color: "#60A5FA", icon: "globe" },
} as const;

const ANALYTIC_METADATA: Record<
  string,
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

const getTimeRangeDays = (timeRange: TimeRange): number => {
  return parseInt(timeRange.replace(/[^\d]/g, ""));
};

const MAX_BAR_ENTRIES = 6;

type RangeGroup = Record<number, StatisticEntry>;
type TypeRangeGroups = Record<AnalyticType, RangeGroup>;

const groupByTimeRanges = (
  entries: StatisticEntry[],
  days: number
): StatisticEntry[] => {
  if (days <= MAX_BAR_ENTRIES) return entries;

  const timestamps = entries.map(e => e.created_at.getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const rangeSize = (maxTime - minTime) / MAX_BAR_ENTRIES;

  const groupedByTypeAndRange = entries.reduce<TypeRangeGroups>(
    (acc, entry) => {
      const rangeIndex = Math.floor(
        (entry.created_at.getTime() - minTime) / rangeSize
      );

      if (!acc[entry.type]) {
        acc[entry.type] = {};
      }

      if (!acc[entry.type][rangeIndex]) {
        acc[entry.type][rangeIndex] = { ...entry, value: 0 };
      }

      acc[entry.type][rangeIndex].value += entry.value;
      return acc;
    },
    {} as TypeRangeGroups
  );

  return Object.values(groupedByTypeAndRange)
    .flatMap<StatisticEntry>(ranges => Object.values(ranges))
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
};

const groupForPieChart = (entries: StatisticEntry[]): StatisticEntry[] => {
  const statisticDict = entries.reduce<Record<AnalyticType, StatisticEntry>>(
    (acc, entry) => {
      acc[entry.type] = acc[entry.type] ?? entry;
      acc[entry.type].value += entry.value;
      return acc;
    },
    {} as Record<AnalyticType, StatisticEntry>
  );
  return Object.values(statisticDict);
};

const enrichWithMetadata = (entry: StatisticEntry): StatisticEntry => {
  const metadata = ANALYTIC_METADATA[entry.type];
  return {
    ...entry,
    label: metadata.label,
    color: metadata.color,
    icon: metadata.icon,
  };
};

export const getAnalyticData = async (
  types: AnalyticType[],
  timeRange: TimeRange,
  displayType: StatisticsDisplayType,
  organizationId: number
): Promise<StatisticEntry[]> => {
  const endDate = new Date();
  const days = getTimeRangeDays(timeRange);
  const startDate = startOfDay(subDays(endDate, days));

  const { data } = await axiosInstance.get<StatisticEntry[]>(
    apiUrls.analytics.base(),
    {
      params: {
        organizationId,
        analyticTypes: types,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    }
  );

  const parsedData = data
    .map(entry => ({
      ...entry,
      created_at: new Date(entry.created_at),
    }))
    .map(enrichWithMetadata);

  if (displayType === StatisticsDisplayType.BAR) {
    return groupByTimeRanges(parsedData, days);
  }

  if (displayType === StatisticsDisplayType.PIE) {
    return groupForPieChart(parsedData);
  }

  return parsedData;
};
