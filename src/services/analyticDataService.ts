import {
  mockData,
  StatisticEntry,
  getAggregatedData,
  calculateTrend,
} from "./mockData";
import { AnalyticType, TimeRange, analyticOptions } from "./analyticTypes";

export interface AnalyticData {
  id: AnalyticType;
  data: StatisticEntry[];
  trend?: {
    value: number;
    isPositive: boolean;
  };
  currentValue: number | string;
}

const getDataForType = (
  type: AnalyticType,
  timeRange: TimeRange
): AnalyticData => {
  let data: StatisticEntry[] = [];

  switch (type) {
    case AnalyticType.TOTAL_USERS:
      data = getAggregatedData(mockData.totalUsers, timeRange);
      break;
    case AnalyticType.NEW_USERS:
      data = getAggregatedData(mockData.newUsers, timeRange);
      break;
    case AnalyticType.RECURRING_USERS:
      data = getAggregatedData(mockData.recurringUsers, timeRange);
      break;
    case AnalyticType.SESSIONS:
      data = getAggregatedData(mockData.sessions, timeRange);
      break;
    case AnalyticType.IA_MESSAGES:
      data = getAggregatedData(mockData.iaMessages, timeRange);
      break;
    case AnalyticType.HITL_MESSAGES:
      data = getAggregatedData(mockData.hitlMessages, timeRange);
      break;
    case AnalyticType.TOTAL_MESSAGES:
      data = getAggregatedData(mockData.totalMessages, timeRange);
      break;
    case AnalyticType.AVG_IA_MESSAGES_PER_SESSION:
      data = getAggregatedData(mockData.avgIaMessagesPerSession, timeRange);
      break;
    case AnalyticType.AVG_HITL_MESSAGES_PER_SESSION:
      data = getAggregatedData(mockData.avgHitlMessagesPerSession, timeRange);
      break;
    case AnalyticType.AVG_SESSIONS_PER_USER:
      data = getAggregatedData(mockData.avgSessionsPerUser, timeRange);
      break;
    case AnalyticType.MESSAGES_BY_CHANNEL:
      data = getAggregatedData(mockData.messagesByChannel, timeRange);
      break;
    case AnalyticType.FUNCTION_CALLS:
      data = getAggregatedData(mockData.functionCalls, timeRange);
      break;
    case AnalyticType.FUNCTIONS_PER_SESSION:
      data = getAggregatedData(mockData.functionsPerSession, timeRange);
      break;
  }

  const currentValue = data[data.length - 1]?.value || 0;
  const trend = calculateTrend(data);

  return {
    id: type,
    data,
    trend,
    currentValue:
      type === AnalyticType.MESSAGES_BY_CHANNEL
        ? formatChannelData(data)
        : currentValue,
  };
};

const formatChannelData = (data: StatisticEntry[]): string => {
  const latest = data.filter(d => d.date === data[data.length - 1].date);
  return latest.reduce((acc, curr) => acc + curr.value, 0).toString();
};

export const getAnalyticData = (
  types: AnalyticType[],
  timeRange: TimeRange
): AnalyticData[] => {
  return types.map(type => getDataForType(type, timeRange));
};

export const getAnalyticOptions = () => analyticOptions;
