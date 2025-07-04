import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { createChartGradient } from "../utils/chartUtils";
import { baseChartOptions } from "../constants/chartOptions";

interface AreaChartProps {
  data: ChartData<"line">;
  series: Array<{ color: string }>;
  showLegend?: boolean;
}

export const AreaChart = ({ data, series, showLegend }: AreaChartProps) => {
  try {
    // Validación defensiva
    if (
      !data ||
      !data.datasets ||
      !Array.isArray(data.datasets) ||
      data.datasets.length === 0
    ) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-gray-500">No hay datos para mostrar</span>
        </div>
      );
    }

    if (!series || !Array.isArray(series)) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-gray-500">
            Error en la configuración de series
          </span>
        </div>
      );
    }

    const processedDatasets = data.datasets.map((dataset, index) => {
      try {
        if (!dataset || typeof dataset !== "object") {
          return {
            label: `Dataset ${index}`,
            data: [],
            borderColor: "#ccc",
            backgroundColor: "#ccc",
            fill: true,
            tension: 0.4,
            borderWidth: 1,
          };
        }

        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx)
          return {
            ...dataset,
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            borderColor: "#ccc",
            backgroundColor: "#ccc",
          };

        const seriesColor = series[index]?.color || "#ccc";
        const gradient = createChartGradient(ctx, seriesColor);

        return {
          ...dataset,
          fill: true,
          tension: 0.4,
          borderWidth: 1,
          borderColor: seriesColor,
          backgroundColor: gradient,
        };
      } catch (datasetError) {
        return {
          label: `Dataset ${index}`,
          data: [],
          borderColor: "#ccc",
          backgroundColor: "#ccc",
          fill: true,
          tension: 0.4,
          borderWidth: 1,
        };
      }
    });

    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-[90%] w-[90%]">
          <Line
            data={{
              ...data,
              datasets: processedDatasets,
            }}
            options={{
              ...baseChartOptions,
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
  } catch (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <span className="text-gray-500">Error al renderizar gráfico</span>
      </div>
    );
  }
};
