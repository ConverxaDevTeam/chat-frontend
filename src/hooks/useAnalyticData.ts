import { useMemo } from "react";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "../services/analyticTypes";
import { getAnalyticData } from "../services/analyticDataService";
import { StatisticEntry } from "../services/mockData";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
    tension?: number;
  }>;
}

interface MetricData {
  value: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  series: Array<{
    label: string;
    value: number;
    color?: string;
    icon?: string;
  }>;
}

type AnalyticResult = {
  chartData?: ChartData;
} & MetricData;

const calculateTrend = (entries: StatisticEntry[]): MetricData["trend"] => {
  if (entries.length < 2) return undefined;

  const sorted = [...entries].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime()
  );
  const lastValue = sorted[sorted.length - 1].value;
  const previousValue = sorted[sorted.length - 2].value;
  const difference = lastValue - previousValue;
  const percentageChange = (difference / previousValue) * 100;

  return {
    value: Math.abs(Math.round(percentageChange)),
    isPositive: difference >= 0,
  };
};

export const useAnalyticData = (
  analyticTypes: AnalyticType[],
  displayType: StatisticsDisplayType,
  timeRange: TimeRange
): AnalyticResult => {
  return useMemo(() => {
    const entries = getAnalyticData(analyticTypes, timeRange);
    const sortedEntries = entries.sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime()
    );

    const groupedByType = sortedEntries.reduce<
      Record<AnalyticType, StatisticEntry[]>
    >(
      (acc, entry) => ({
        ...acc,
        [entry.type]: [...(acc[entry.type] || []), entry],
      }),
      {} as Record<AnalyticType, StatisticEntry[]>
    );

    const lastEntries = Object.values(groupedByType).map(
      typeEntries => typeEntries[typeEntries.length - 1]
    );

    const totalValue = lastEntries.reduce((sum, entry) => sum + entry.value, 0);

    if (displayType === StatisticsDisplayType.METRIC) {
      return {
        value: totalValue,
        trend: calculateTrend(sortedEntries),
        series: lastEntries.map(entry => ({
          label: entry.label,
          value: entry.value,
          color: entry.color,
          icon: entry.icon,
        })),
      };
    }

    const uniqueDates = [
      ...new Set(
        sortedEntries.map(e => e.created_at.toISOString().split("T")[0])
      ),
    ];

    return {
      value: totalValue,
      trend: calculateTrend(sortedEntries),
      series: lastEntries.map(entry => ({
        label: entry.label,
        value: entry.value,
        color: entry.color,
        icon: entry.icon,
      })),
      chartData: {
        labels: uniqueDates,
        datasets: Object.entries(groupedByType).map(([_, typeEntries]) => {
          const firstEntry = typeEntries[0];
          return {
            label: firstEntry.label,
            data: uniqueDates.map(date => {
              const entry = typeEntries.find(
                e => e.created_at.toISOString().split("T")[0] === date
              );
              return entry?.value || 0;
            }),
            borderColor: firstEntry.color,
            backgroundColor:
              displayType === StatisticsDisplayType.PIE
                ? Object.values(groupedByType).map(e => e[0].color)
                : displayType === StatisticsDisplayType.AREA
                  ? `${firstEntry.color}1A`
                  : firstEntry.color,
            fill: displayType === StatisticsDisplayType.AREA,
            tension: 0.4,
          };
        }),
      },
    };
  }, [analyticTypes, displayType, timeRange]);
};
