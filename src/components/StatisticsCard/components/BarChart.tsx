import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { baseChartOptions } from "../constants/chartOptions";
import { createChartGradient } from "../utils/chartUtils";

interface BarChartProps {
  data: ChartData<"bar">;
  series: Array<{ color: string }>;
  showLegend?: boolean;
}

export const BarChart = ({ data, series, showLegend }: BarChartProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-[90%] w-[90%]">
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
            responsive: true,
            plugins: {
              legend: {
                display: showLegend,
                position: 'top',
                align: 'center',
                labels: {
                  font: {
                    family: "'Quicksand', sans-serif",
                    size: 10
                  },
                  color: '#001126',
                  padding: 8,
                  usePointStyle: true,
                  pointStyle: 'circle',
                  boxWidth: 6,
                  boxHeight: 6
                }
              },
            },
            layout: {
              padding: {
                top: showLegend ? 10 : 0
              }
            }
          }}
        />
      </div>
    </div>
  );
};
