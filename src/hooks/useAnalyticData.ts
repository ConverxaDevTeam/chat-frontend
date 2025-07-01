import { useMemo, useEffect, useState } from "react";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
  analyticOptions,
} from "../services/analyticTypes";
import { getAnalyticData } from "../services/analyticDataService";
import { StatisticEntry } from "../services/mockData";
import { useSelector } from "react-redux";
import { RootState } from "@store";

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
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }>;
}

export type AnalyticResult = {
  chartData?: ChartData;
} & MetricData;

const calculateTrendForType = (
  entries: StatisticEntry[],
  displayType: StatisticsDisplayType,
  analyticType: AnalyticType
): { value: number; isPositive: boolean } | undefined => {
  const typeEntries = entries.filter(entry => entry.type === analyticType);

  if (typeEntries.length < 2) return undefined;

  // Ordenar por fecha
  const sorted = [...typeEntries].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime()
  );

  // Preparar datos según el tipo de display
  let points: Array<{ x: number; y: number }>;
  const startTime = sorted[0].created_at.getTime();

  if (displayType === StatisticsDisplayType.METRIC_AVG) {
    // Para promedio, agrupar por día y calcular promedio diario
    const dailyGroups = sorted.reduce(
      (acc, entry) => {
        const dayKey = entry.created_at.toISOString().split("T")[0];
        acc[dayKey] = acc[dayKey] || [];
        acc[dayKey].push(entry);
        return acc;
      },
      {} as Record<string, StatisticEntry[]>
    );

    points = Object.entries(dailyGroups).map(([dateStr, dayEntries]) => {
      const date = new Date(dateStr);
      const daysSinceStart =
        (date.getTime() - startTime) / (1000 * 60 * 60 * 24);
      const avgValue =
        dayEntries.reduce((sum, entry) => sum + entry.value, 0) /
        dayEntries.length;
      return { x: daysSinceStart, y: avgValue };
    });
  } else {
    // Para suma/acumulado, usar valores directos
    points = sorted.map(entry => ({
      x: (entry.created_at.getTime() - startTime) / (1000 * 60 * 60 * 24),
      y: entry.value,
    }));
  }

  if (points.length < 2) return undefined;

  // Calcular porcentaje de cambio entre primer y último punto
  const firstValue = points[0].y;
  const lastValue = points[points.length - 1].y;

  if (firstValue === 0) {
    // Si empezamos en 0, mostrar como crecimiento absoluto
    return {
      value: Math.abs(Math.round(lastValue)),
      isPositive: lastValue >= 0,
    };
  }

  const percentageChange =
    ((lastValue - firstValue) / Math.abs(firstValue)) * 100;

  return {
    value: Math.round(Math.abs(percentageChange)),
    isPositive: percentageChange >= 0,
  };
};

const calculateTrend = (
  entries: StatisticEntry[],
  displayType: StatisticsDisplayType,
  requestedTypes: AnalyticType[]
): MetricData["trend"] => {
  if (entries.length === 0) return undefined;

  // Para una sola métrica, calcular tendencia global
  if (requestedTypes.length === 1) {
    return calculateTrendForType(entries, displayType, requestedTypes[0]);
  }

  // Para múltiples métricas, no calcular tendencia global
  return undefined;
};

const getDefaultMetadata = (type: AnalyticType) => {
  const option = analyticOptions.find(opt => opt.id === type);
  return {
    label: option?.label || String(type),
    color: "#ccc",
    icon: undefined,
  };
};

const processEntries = (entries: StatisticEntry[]) => {
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
};

const getMetricData = (
  groupedByType: Record<AnalyticType, StatisticEntry[]>,
  sortedEntries: StatisticEntry[],
  displayType: StatisticsDisplayType,
  requestedTypes: AnalyticType[]
) => {
  const series = requestedTypes.map(type => {
    const typeEntries = groupedByType[type];

    if (!typeEntries || typeEntries.length === 0) {
      // Si no hay datos para este tipo, devolver 0 con metadatos por defecto
      const metadata = getDefaultMetadata(type);
      return {
        label: metadata.label,
        value: 0,
        color: metadata.color,
        icon: metadata.icon,
        trend: undefined,
      };
    }

    const firstEntry = typeEntries[0];
    let value: number;

    if (displayType === StatisticsDisplayType.METRIC_AVG) {
      // Calcular promedio
      const sum = typeEntries.reduce((acc, entry) => acc + entry.value, 0);
      value = Math.round((sum / typeEntries.length) * 100) / 100;
    } else {
      // Calcular suma (METRIC_ACUM, METRIC)
      value = typeEntries.reduce((acc, entry) => acc + entry.value, 0);
    }

    // Calcular tendencia individual para esta métrica
    const individualTrend = calculateTrendForType(
      sortedEntries,
      displayType,
      type
    );

    return {
      label: String(firstEntry.label || firstEntry.type),
      value: value,
      color: firstEntry.color,
      icon: firstEntry.icon,
      trend: individualTrend,
    };
  });

  const totalValue = series.reduce((sum, serie) => sum + serie.value, 0);

  return {
    value: totalValue,
    trend: calculateTrend(sortedEntries, displayType, requestedTypes),
    series: series,
  };
};

const getChartData = (
  groupedByType: Record<AnalyticType, StatisticEntry[]>,
  sortedEntries: StatisticEntry[],
  displayType: StatisticsDisplayType,
  requestedTypes: AnalyticType[]
) => {
  if (displayType === StatisticsDisplayType.PIE) {
    const allTypes = requestedTypes.map(type => {
      const entries = groupedByType[type];
      if (!entries || entries.length === 0) {
        const metadata = getDefaultMetadata(type);
        return {
          label: metadata.label,
          value: 0,
          color: metadata.color,
          type: type,
        };
      }
      return entries[0];
    });

    return {
      labels: allTypes.map(e => e.label || String(e.type)),
      datasets: [
        {
          label: "",
          data: allTypes.map(e => e.value || 0),
          backgroundColor: allTypes.map(e => e.color || "#ccc"),
          borderColor: "#ffffff",
          borderWidth: 2,
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
    datasets: requestedTypes.map(type => {
      const typeEntries = groupedByType[type];

      if (!typeEntries || typeEntries.length === 0) {
        const metadata = getDefaultMetadata(type);
        return {
          label: metadata.label,
          data: uniqueDates.map(() => 0),
          borderColor: metadata.color,
          backgroundColor: metadata.color,
          fill: displayType === StatisticsDisplayType.AREA,
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 6,
        };
      }

      const firstEntry = typeEntries[0];
      return {
        label: firstEntry.label || String(type),
        data: uniqueDates.map(date => {
          const entry = typeEntries.find(
            e => e.created_at.toISOString().split("T")[0] === date
          );
          return entry?.value || 0;
        }),
        borderColor: firstEntry.color || "#666",
        backgroundColor: firstEntry.color || "#666",
        fill: displayType === StatisticsDisplayType.AREA,
        tension: 0.4,
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 6,
      };
    }),
  };
};

export const useAnalyticData = (
  analyticTypes: AnalyticType[],
  displayType: StatisticsDisplayType,
  timeRange: TimeRange
): AnalyticResult | null => {
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
  );
  const [entries, setEntries] = useState<StatisticEntry[]>([]);

  useEffect(() => {
    if (!analyticTypes?.length || !organizationId) return;

    getAnalyticData(analyticTypes, timeRange, displayType, organizationId)
      .then(setEntries)
      .catch(error => {
        console.error("Error getting analytic data:", error);
        setEntries([]);
      });
  }, [analyticTypes, timeRange, displayType, organizationId]);

  return useMemo(() => {
    if (!entries.length) return null;

    const { groupedByType, sortedEntries } = processEntries(entries);
    const metricData = getMetricData(
      groupedByType,
      sortedEntries,
      displayType,
      analyticTypes
    );

    if (
      displayType === StatisticsDisplayType.METRIC ||
      displayType === StatisticsDisplayType.METRIC_AVG ||
      displayType === StatisticsDisplayType.METRIC_ACUM
    ) {
      return metricData;
    }

    const chartData = getChartData(
      groupedByType,
      sortedEntries,
      displayType,
      analyticTypes
    );
    return { ...metricData, chartData };
  }, [entries, displayType]);
};
