import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "./analyticTypes";
import { StatisticEntry, getDataInRange, getMockData } from "./mockData";
import { startOfDay, subDays } from "date-fns";

const getTimeRangeDays = (timeRange: TimeRange): number => {
  return parseInt(timeRange.replace(/[^\d]/g, ""));
};

const MAX_BAR_ENTRIES = 6;

type RangeGroup = Record<number, StatisticEntry>;
type TypeRangeGroups = Record<AnalyticType, RangeGroup>;

const groupDataByRanges = (
  entries: StatisticEntry[],
  days: number
): StatisticEntry[] => {
  if (days <= MAX_BAR_ENTRIES) return entries;

  const timestamps = entries.map(e => e.created_at.getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const rangeSize = (maxTime - minTime) / MAX_BAR_ENTRIES;

  // Primero agrupamos por tipo y rango
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

  // Convertimos el resultado a un array plano manteniendo la separación por tipo
  return Object.values(groupedByTypeAndRange)
    .flatMap<StatisticEntry>(ranges => Object.values(ranges))
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
};

export const getAnalyticData = (
  types: AnalyticType[],
  timeRange: TimeRange,
  displayType: StatisticsDisplayType
): StatisticEntry[] => {
  const endDate = startOfDay(new Date());
  const days = getTimeRangeDays(timeRange);
  const startDate = startOfDay(subDays(endDate, days));

  const data = types.flatMap(type => {
    const typeData = getMockData(type, days);
    return getDataInRange(typeData, startDate, endDate);
  });

  return displayType === StatisticsDisplayType.BAR
    ? groupDataByRanges(data, days)
    : data;
};
