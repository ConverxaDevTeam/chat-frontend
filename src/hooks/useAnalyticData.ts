import { useMemo } from "react";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "../services/analyticTypes";
import { getAnalyticData } from "../services/analyticDataService";

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

export const useAnalyticData = (
  analyticType: AnalyticType,
  displayType: StatisticsDisplayType,
  timeRange: TimeRange
): AnalyticResult => {
  return useMemo(() => {
    const rawData = getAnalyticData(analyticType, timeRange);
    const lastValues = rawData.series.map(s => s.data[s.data.length - 1]);

    if (displayType === StatisticsDisplayType.METRIC) {
      return {
        value: lastValues[0],
        trend: rawData.trend
          ? {
              value: Math.abs(rawData.trend),
              isPositive: rawData.trend > 0,
            }
          : undefined,
        series: rawData.series.map((serie, index) => ({
          label: serie.label,
          value: lastValues[index],
          color: serie.color,
          icon: serie.icon,
        })),
      };
    }

    return {
      value: lastValues[0],
      trend: rawData.trend
        ? {
            value: Math.abs(rawData.trend),
            isPositive: rawData.trend > 0,
          }
        : undefined,
      series: rawData.series.map((serie, index) => ({
        label: serie.label,
        value: lastValues[index],
        color: serie.color,
        icon: serie.icon,
      })),
      chartData: {
        labels: rawData.labels || [],
        datasets: rawData.series.map((serie, index) => ({
          label: serie.label,
          data: serie.data,
          borderColor: serie.color || (index === 0 ? "#10B981" : "#60A5FA"),
          backgroundColor:
            displayType === StatisticsDisplayType.PIE
              ? ["#10B981", "#60A5FA", "#F59E0B", "#EC4899"]
              : displayType === StatisticsDisplayType.AREA
                ? `${serie.color || (index === 0 ? "#10B981" : "#60A5FA")}1A`
                : serie.color || (index === 0 ? "#10B981" : "#60A5FA"),
          fill: displayType === StatisticsDisplayType.AREA,
          tension: 0.4,
        })),
      },
    };
  }, [analyticType, displayType, timeRange]);
};
