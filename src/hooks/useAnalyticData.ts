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

export type AnalyticResult = {
  chartData?: ChartData;
} & MetricData;

const calculateTrend = (entries: StatisticEntry[]): MetricData["trend"] => {
  // Agrupar por tipo
  const entriesByType = entries.reduce(
    (acc, entry) => {
      acc[entry.type] = acc[entry.type] || [];
      acc[entry.type].push(entry);
      return acc;
    },
    {} as Record<string, StatisticEntry[]>
  );

  // Filtrar solo los tipos con suficientes datos
  const validEntries = Object.values(entriesByType)
    .filter(typeEntries => typeEntries.length >= 2)
    .flat();

  if (validEntries.length === 0) return undefined;

  const sorted = [...validEntries].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime()
  );

  // Convertir fechas a números (días desde el inicio)
  const startTime = sorted[0].created_at.getTime();
  const points = sorted.map(entry => ({
    x: (entry.created_at.getTime() - startTime) / (1000 * 60 * 60 * 24),
    y: entry.value,
  }));

  // Calcular medias
  const n = points.length;
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;

  // Calcular pendiente (m) de la línea de regresión
  const numerator = points.reduce(
    (sum, p) => sum + (p.x - meanX) * (p.y - meanY),
    0
  );
  const denominator = points.reduce(
    (sum, p) => sum + Math.pow(p.x - meanX, 2),
    0
  );
  const slope = numerator / denominator;

  // Calcular el porcentaje de cambio total
  const firstValue = sorted[0].value;
  const predictedChange = ((slope * (n - 1)) / firstValue) * 100;

  return {
    value: Math.abs(Math.round(predictedChange)),
    isPositive: slope >= 0,
  };
};

const useGroupedEntries = (entries: StatisticEntry[]) => {
  return useMemo(() => {
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

    return { groupedByType, lastEntries, sortedEntries };
  }, [entries]);
};

const useMetricData = (
  lastEntries: StatisticEntry[],
  sortedEntries: StatisticEntry[]
) => {
  return useMemo(() => {
    console.log(lastEntries, sortedEntries);
    const totalValue = lastEntries.reduce((sum, entry) => sum + entry.value, 0);
    console.log(totalValue);
    return {
      value: totalValue,
      trend: calculateTrend(sortedEntries),
      series: lastEntries.map(entry => ({
        label: String(entry.label || entry.type),
        value: entry.value,
        color: entry.color,
        icon: entry.icon,
      })),
    };
  }, [lastEntries, sortedEntries]);
};

const useChartData = (
  groupedByType: Record<AnalyticType, StatisticEntry[]>,
  sortedEntries: StatisticEntry[],
  displayType: StatisticsDisplayType
) => {
  return useMemo(() => {
    if (displayType === StatisticsDisplayType.PIE) {
      const allTypes = Object.values(groupedByType).map(entries => entries[0]);
      return {
        labels: allTypes.map(e => e.label),
        datasets: [
          {
            label: "",
            data: allTypes.map(e => e.value),
            backgroundColor: allTypes.map(e => e.color),
            borderColor: "#ffffff",
            fill: false,
            tension: 0.4,
          },
        ],
      };
    }

    const uniqueDates = [
      ...new Set(
        sortedEntries.map(e => e.created_at.toISOString().split("T")[0])
      ),
    ];

    return {
      labels: uniqueDates,
      datasets: Object.values(groupedByType).map(typeEntries => {
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
          backgroundColor: firstEntry.color,
          fill: displayType === StatisticsDisplayType.AREA,
          tension: 0.4,
        };
      }),
    };
  }, [groupedByType, sortedEntries, displayType]);
};

export const useAnalyticData = (
  analyticTypes: AnalyticType[],
  displayType: StatisticsDisplayType,
  timeRange: TimeRange
): AnalyticResult | null => {
  const entries = useMemo(() => {
    if (!analyticTypes?.length) return [];

    try {
      return getAnalyticData(analyticTypes, timeRange, displayType);
    } catch (error) {
      console.error("Error getting analytic data:", error);
      return [];
    }
  }, [analyticTypes, timeRange, displayType]);

  if (!entries.length) return null;

  const { groupedByType, lastEntries, sortedEntries } =
    useGroupedEntries(entries);
  const metricData = useMetricData(lastEntries, sortedEntries);
  const chartData = useChartData(groupedByType, sortedEntries, displayType);

  if (displayType === StatisticsDisplayType.METRIC) {
    return metricData;
  }

  return { ...metricData, chartData };
};
