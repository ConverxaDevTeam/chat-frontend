import { subDays, format } from "date-fns";

export interface StatisticEntry {
  date: string;
  value: number;
  channel?: "whatsapp" | "facebook" | "web" | "other";
  type?: "ia" | "hitl";
}

// Genera datos aleatorios para un rango de días
const generateTimeSeriesData = (
  days: number,
  baseValue: number,
  variance: number
): StatisticEntry[] => {
  return Array.from({ length: days }).map((_, index) => ({
    date: format(subDays(new Date(), days - index - 1), "yyyy-MM-dd"),
    value: Math.max(
      0,
      baseValue + Math.floor(Math.random() * variance - variance / 2)
    ),
  }));
};

// Genera datos por canal
const generateChannelData = (days: number): StatisticEntry[] => {
  const channels: ("whatsapp" | "facebook" | "web" | "other")[] = [
    "whatsapp",
    "facebook",
    "web",
    "other",
  ];
  return channels.flatMap(channel =>
    Array.from({ length: days }).map((_, index) => ({
      date: format(subDays(new Date(), days - index - 1), "yyyy-MM-dd"),
      value: Math.floor(Math.random() * 100),
      channel,
    }))
  );
};

// Mock data para cada tipo de estadística
export const mockData = {
  totalUsers: generateTimeSeriesData(30, 35, 10),
  newUsers: generateTimeSeriesData(30, 18, 8),
  recurringUsers: generateTimeSeriesData(30, 23, 6),
  sessions: generateTimeSeriesData(30, 267, 50),
  iaMessages: generateTimeSeriesData(30, 897, 100),
  hitlMessages: generateTimeSeriesData(30, 567, 80),
  totalMessages: generateTimeSeriesData(30, 1024, 200),
  avgIaMessagesPerSession: generateTimeSeriesData(30, 87, 20),
  avgHitlMessagesPerSession: generateTimeSeriesData(30, 245, 40),
  avgSessionsPerUser: generateTimeSeriesData(30, 267, 30),
  messagesByChannel: generateChannelData(30),
  functionCalls: generateTimeSeriesData(30, 421, 60),
  functionsPerSession: generateTimeSeriesData(30, 3, 2),
};

// Función para obtener datos agrupados por periodo
export const getAggregatedData = (
  data: StatisticEntry[],
  period: "7d" | "30d" | "6m" | "1y" = "30d"
): StatisticEntry[] => {
  const days =
    period === "7d" ? 7 : period === "30d" ? 30 : period === "6m" ? 180 : 365;
  return data.slice(-days);
};

// Función para calcular tendencia
export const calculateTrend = (
  data: StatisticEntry[]
): { value: number; isPositive: boolean } => {
  if (data.length < 2) return { value: 0, isPositive: true };

  const lastValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;
  const difference = lastValue - previousValue;
  const percentageChange = (difference / previousValue) * 100;

  return {
    value: Math.abs(Math.round(percentageChange)),
    isPositive: difference >= 0,
  };
};
