import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { createChartGradient } from "../utils/chartUtils";
import { baseChartOptions } from "../constants/chartOptions";

interface AreaChartProps {
  data: ChartData<"line">;
  series: Array<{ color: string }>;
}

export const AreaChart = ({ data, series }: AreaChartProps) => {
  return (
    <Line
      data={{
        ...data,
        datasets: data.datasets.map((dataset, index) => {
          const ctx = document.createElement("canvas").getContext("2d");
          if (!ctx) return dataset;

          const gradient = createChartGradient(ctx, series[index].color);

          return {
            ...dataset,
            fill: "origin",
            tension: 0.4,
            borderWidth: 1,
            borderColor: series[index].color,
            backgroundColor: gradient,
          };
        }),
      }}
      options={{
        ...baseChartOptions,
        maintainAspectRatio: false,
        aspectRatio: 14.4,
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
          },
          line: {
            tension: 0.4,
            borderWidth: 1,
          },
        },
      }}
    />
  );
};
