import { ChartData, ChartOptions } from "chart.js";
import { Pie } from "react-chartjs-2";

interface PieChartProps {
  data: ChartData<"pie">;
  series: Array<{ color: string }>;
  showLegend?: boolean;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  const colorWithOpacity = (opacity: number) => {
    const rgb = hexToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };
  gradient.addColorStop(0, colorWithOpacity(1.0));
  gradient.addColorStop(0.4, colorWithOpacity(0.8));
  gradient.addColorStop(0.8, colorWithOpacity(0.6));
  return gradient;
};

const pieOptions: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      align: "start",
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        padding: 20,
        font: {
          family: "'Quicksand', sans-serif",
          size: 12,
          weight: 500,
        },
        color: "#64748B",
      },
    },
    tooltip: {
      backgroundColor: "#ffffff",
      titleColor: "#1E293B",
      bodyColor: "#1E293B",
      bodyFont: {
        family: "'Quicksand', sans-serif",
        size: 12,
        weight: 500,
      },
      padding: 12,
      borderColor: "#E2E8F0",
      borderWidth: 1,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      usePointStyle: true,
    },
  },
  cutout: "40%",
  elements: {
    arc: {
      borderWidth: 2,
    },
  },
};

export const PieChart = ({ data, showLegend }: PieChartProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-[90%] w-[90%]">
        <Pie
          data={{
            ...data,
            datasets: data.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: context => {
                const chart = context.chart;
                const { ctx } = chart;
                const colors = dataset.backgroundColor as string[];
                const index = context.dataIndex;
                return createGradient(ctx, colors[index]);
              },
            })),
          }}
          options={{
            ...pieOptions,
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                display: showLegend,
                position: "top",
                align: "center",
                labels: {
                  font: {
                    family: "'Quicksand', sans-serif",
                    size: 10,
                  },
                  color: "#001126",
                  padding: 8,
                  usePointStyle: true,
                  pointStyle: "circle",
                  boxWidth: 6,
                  boxHeight: 6,
                },
              },
            },
            layout: {
              padding: {
                top: showLegend ? 10 : 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
