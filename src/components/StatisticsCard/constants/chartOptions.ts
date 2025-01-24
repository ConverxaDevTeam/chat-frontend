import { ChartOptions } from "chart.js";

export const baseChartOptions: ChartOptions<"line" | "bar"> = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#A6A8AB",
        font: {
          family: "'Quicksand', sans-serif",
          size: 12,
          weight: 500,
        },
      },
    },
    y: {
      grid: {
        color: "#E9E9E9",
        lineWidth: 1,
        drawTicks: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: true,
        align: "end",
        color: "#A6A8AB",
        font: {
          family: "'Quicksand', sans-serif",
          size: 12,
          weight: 500,
        },
        padding: 8,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        padding: 15,
        font: {
          family: "'Quicksand', sans-serif",
          size: 10,
          weight: "normal",
        },
        color: "#001126",
      },
    },
  },
};
