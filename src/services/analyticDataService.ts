import { AnalyticType, TimeRange } from "./analyticTypes";
import { StatisticEntry, getDataInRange, getMockData } from "./mockData";
import { startOfDay, subDays } from "date-fns";

export const getAnalyticData = (
  types: AnalyticType[],
  timeRange: TimeRange
): StatisticEntry[] => {
  const endDate = startOfDay(new Date());
  const startDate = startOfDay(
    subDays(endDate, timeRange === TimeRange.LAST_7_DAYS ? 7 : 30)
  );

  return types.flatMap(type => {
    const data = getMockData(type);
    return getDataInRange(data, startDate, endDate);
  });
};
