import { AnalyticType, TimeRange } from "./analyticTypes";

interface StatisticEntry {
  timestamp: string;
  value: number;
}

interface AnalyticData {
  type: AnalyticType;
  entries: StatisticEntry[];
}

const generateMockData = (timeRange: TimeRange): StatisticEntry[] => {
  const now = new Date();
  const data: StatisticEntry[] = [];
  let days = 0;

  switch (timeRange) {
    case TimeRange.LAST_DAY:
      days = 1;
      break;
    case TimeRange.LAST_7_DAYS:
      days = 7;
      break;
    case TimeRange.LAST_30_DAYS:
      days = 30;
      break;
    case TimeRange.LAST_90_DAYS:
      days = 90;
      break;
    case TimeRange.LAST_180_DAYS:
      days = 180;
      break;
    case TimeRange.LAST_365_DAYS:
    case TimeRange.LAST_YEAR:
      days = 365;
      break;
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      timestamp: date.toISOString(),
      value: Math.floor(Math.random() * 1000),
    });
  }

  return data;
};

const mockData = {
  totalUsers: (timeRange: TimeRange) => generateMockData(timeRange),
  newUsers: (timeRange: TimeRange) => generateMockData(timeRange),
  recurringUsers: (timeRange: TimeRange) => generateMockData(timeRange),
  sessions: (timeRange: TimeRange) => generateMockData(timeRange),
  iaMessages: (timeRange: TimeRange) => generateMockData(timeRange),
  hitlMessages: (timeRange: TimeRange) => generateMockData(timeRange),
  totalMessages: (timeRange: TimeRange) => generateMockData(timeRange),
  avgIaMessagesPerSession: (timeRange: TimeRange) =>
    generateMockData(timeRange),
  avgHitlMessagesPerSession: (timeRange: TimeRange) =>
    generateMockData(timeRange),
  avgSessionsPerUser: (timeRange: TimeRange) => generateMockData(timeRange),
  messagesByChannel: (timeRange: TimeRange) => generateMockData(timeRange),
  functionCalls: (timeRange: TimeRange) => generateMockData(timeRange),
  functionsPerSession: (timeRange: TimeRange) => generateMockData(timeRange),
};

const getDataForType = (
  type: AnalyticType,
  timeRange: TimeRange
): AnalyticData => {
  let entries: StatisticEntry[] = [];

  switch (type) {
    case AnalyticType.TOTAL_USERS:
      entries = mockData.totalUsers(timeRange);
      break;
    case AnalyticType.NEW_USERS:
      entries = mockData.newUsers(timeRange);
      break;
    case AnalyticType.RECURRING_USERS:
      entries = mockData.recurringUsers(timeRange);
      break;
    case AnalyticType.SESSIONS:
      entries = mockData.sessions(timeRange);
      break;
    case AnalyticType.IA_MESSAGES:
      entries = mockData.iaMessages(timeRange);
      break;
    case AnalyticType.HITL_MESSAGES:
      entries = mockData.hitlMessages(timeRange);
      break;
    case AnalyticType.TOTAL_MESSAGES:
      entries = mockData.totalMessages(timeRange);
      break;
    case AnalyticType.AVG_IA_MESSAGES_PER_SESSION:
      entries = mockData.avgIaMessagesPerSession(timeRange);
      break;
    case AnalyticType.AVG_HITL_MESSAGES_PER_SESSION:
      entries = mockData.avgHitlMessagesPerSession(timeRange);
      break;
    case AnalyticType.AVG_SESSIONS_PER_USER:
      entries = mockData.avgSessionsPerUser(timeRange);
      break;
    case AnalyticType.MESSAGES_BY_CHANNEL:
      entries = mockData.messagesByChannel(timeRange);
      break;
    case AnalyticType.FUNCTION_CALLS:
      entries = mockData.functionCalls(timeRange);
      break;
    case AnalyticType.FUNCTIONS_PER_SESSION:
      entries = mockData.functionsPerSession(timeRange);
      break;
  }

  return { type, entries };
};

export const getLatestValue = (data: AnalyticData): string => {
  const latest = data.entries.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return latest[0]?.value.toString() || "0";
};

export const getAnalyticData = async (
  types: AnalyticType[],
  timeRange: TimeRange
): Promise<AnalyticData[]> => {
  return Promise.all(
    types.map(async type => {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return getDataForType(type, timeRange);
    })
  );
};
