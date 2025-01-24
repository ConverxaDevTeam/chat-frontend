import { AnalyticType, TimeRange } from "./analyticTypes";
import { StatisticEntry, getDataInRange, getMockData } from "./mockData";
import { startOfDay, subDays } from "date-fns";

const getTimeRangeDays = (timeRange: TimeRange): number => {
  return parseInt(timeRange.replace(/[^\d]/g, ""));
};

export const getAnalyticData = (
  types: AnalyticType[],
  timeRange: TimeRange
): StatisticEntry[] => {
  const endDate = startOfDay(new Date());
  const days = getTimeRangeDays(timeRange);
  const startDate = startOfDay(subDays(endDate, days));

  return types.flatMap(type => {
    const data = getMockData(type, days);
    return getDataInRange(data, startDate, endDate);
  });
};
