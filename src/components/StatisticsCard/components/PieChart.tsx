import { ChartData, ChartOptions } from "chart.js";
import { Pie } from "react-chartjs-2";

interface PieChartProps {
  data: ChartData<"pie">;
  series: Array<{ color: string }>;
}

const pieOptions: ChartOptions<"pie"> = {
  responsive: true,
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

export const PieChart = ({ data }: PieChartProps) => {
  return (
    <Pie
      data={data}
      options={{
        ...pieOptions,
        maintainAspectRatio: false,
        aspectRatio: 14.4,
      }}
    />
  );
};
