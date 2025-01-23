import { AnalyticType, TimeRange } from "./analyticTypes";
import { mockData, getAggregatedData, calculateTrend } from "./mockData";

interface AnalyticData {
  current: number;
  trend?: number;
  labels?: string[];
  series: Array<{
    label: string;
    data: number[];
    color?: string;
    icon?: string;
  }>;
}

const transformTimeSeriesData = (
  entries: Array<{ date: string; value: number }>
): { labels: string[]; data: number[] } => {
  const sorted = entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return {
    labels: sorted.map(entry => entry.date),
    data: sorted.map(entry => entry.value),
  };
};

const transformChannelData = (
  entries: Array<{ date: string; value: number; channel?: string }>
): { labels: string[]; data: number[] } => {
  const channelTotals = entries.reduce(
    (acc, entry) => {
      if (entry.channel) {
        acc[entry.channel] = (acc[entry.channel] || 0) + entry.value;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    labels: Object.keys(channelTotals),
    data: Object.values(channelTotals),
  };
};

export const getAnalyticData = (
  analyticType: AnalyticType,
  timeRange: TimeRange
): AnalyticData => {
  const period = timeRange === TimeRange.LAST_7_DAYS ? "7d" : "30d";

  switch (analyticType) {
    case AnalyticType.TOTAL_USERS: {
      const data = getAggregatedData(mockData.totalUsers, period);
      const { labels, data: values } = transformTimeSeriesData(data);
      const trend = calculateTrend(data);
      return {
        current: values[values.length - 1],
        trend: trend.value * (trend.isPositive ? 1 : -1),
        labels,
        series: [
          {
            label: "Total Usuarios",
            data: values,
            color: "#10B981",
          },
        ],
      };
    }

    case AnalyticType.TOTAL_MESSAGES: {
      const data = getAggregatedData(mockData.totalMessages, period);
      const { labels, data: values } = transformTimeSeriesData(data);
      const trend = calculateTrend(data);
      return {
        current: values[values.length - 1],
        trend: trend.value * (trend.isPositive ? 1 : -1),
        labels,
        series: [
          {
            label: "Total Mensajes",
            data: values,
            icon: "whatsapp",
          },
        ],
      };
    }

    case AnalyticType.MESSAGES_BY_CHANNEL: {
      const data = getAggregatedData(mockData.messagesByChannel, period);
      const { labels, data: values } = transformChannelData(data);
      return {
        current: values.reduce((a, b) => a + b, 0),
        labels,
        series: [
          {
            label: "Mensajes",
            data: values,
            color: "#60A5FA",
          },
        ],
      };
    }

    case AnalyticType.FUNCTIONS_PER_SESSION: {
      const data = getAggregatedData(mockData.functionsPerSession, period);
      const { labels, data: values } = transformTimeSeriesData(data);
      const trend = calculateTrend(data);
      return {
        current: values[values.length - 1],
        trend: trend.value * (trend.isPositive ? 1 : -1),
        labels,
        series: [
          {
            label: "Funciones",
            data: values,
            color: "#F59E0B",
          },
        ],
      };
    }

    default: {
      const data = getAggregatedData(mockData.totalUsers, period);
      const { labels, data: values } = transformTimeSeriesData(data);
      return {
        current: values[values.length - 1],
        labels,
        series: [
          {
            label: "Valor",
            data: values,
            color: "#EC4899",
          },
        ],
      };
    }
  }
};
