import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { baseChartOptions } from "../constants/chartOptions";
import { createChartGradient } from "../utils/chartUtils";

interface BarChartProps {
  data: ChartData<"bar">;
  series: Array<{ color: string }>;
}

export const BarChart = ({ data, series }: BarChartProps) => {
  return (
    <Bar
      data={{
        ...data,
        datasets: data.datasets.map((dataset, index) => {
          const ctx = document.createElement("canvas").getContext("2d");
          if (!ctx) return dataset;

          const gradient = createChartGradient(ctx, series[index].color);

          return {
            ...dataset,
            borderWidth: 1,
            borderColor: series[index].color,
            backgroundColor: gradient,
            borderRadius: 4,
            barThickness: 20,
          };
        }),
      }}
      options={{
        ...baseChartOptions,
        maintainAspectRatio: false,
        aspectRatio: 14.4,
      }}
    />
  );
};
