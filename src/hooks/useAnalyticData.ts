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

    return {
      label: String(firstEntry.label || firstEntry.type),
      value: value,
      color: firstEntry.color,
      icon: firstEntry.icon,
    };
  });

  const totalValue = series.reduce((sum, serie) => sum + serie.value, 0);

  return {
    value: totalValue,
    trend: calculateTrend(sortedEntries),
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
