import { useState, useRef, useEffect, Fragment } from "react";
import { CardTitle } from "./CardTitle";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { OptionsSelector } from "./OptionsSelector";
import { Line, Bar, Pie } from "react-chartjs-2";
import { ChartData } from "chart.js";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "../../services/analyticTypes";
import { useAnalyticData } from "../../hooks/useAnalyticData";
import "../../config/chartConfig";
import { FaWhatsapp } from "react-icons/fa";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "whatsapp":
      return <FaWhatsapp className="text-[#25D366]" />;
    default:
      return null;
  }
};

export interface StatisticsCardProps {
  id: number;
  title: string;
  analyticTypes: AnalyticType[];
  displayType: StatisticsDisplayType;
  timeRange: TimeRange;
  className?: string;
  showLegend?: boolean;
  onUpdateCard?: (update: {
    id: number;
    title?: string;
    timeRange?: TimeRange;
    analyticTypes?: AnalyticType[];
    displayType?: StatisticsDisplayType;
    showLegend?: boolean;
  }) => void;
}

export const StatisticsCard = ({
  id,
  title,
  analyticTypes,
  displayType,
  timeRange,
  className = "",
  showLegend,
  onUpdateCard,
}: StatisticsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [timeMenu, setTimeMenu] = useState<{ x: number; y: number } | null>(
    null
  );
  const [optionsMenu, setOptionsMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isWide, setIsWide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const data = useAnalyticData(analyticTypes, displayType, timeRange);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        setIsWide(containerRef.current.offsetWidth >= 400);
      }
    };

    checkWidth();
    const observer = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTimeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTimeMenu({
        x: buttonRect.x,
        y: buttonRect.y + buttonRect.height + 4,
      });
    }
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();

    setOptionsMenu({
      x: buttonRect.x,
      y: buttonRect.y + buttonRect.height + 4,
    });
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdateCard?.({ id, title: newTitle });
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    onUpdateCard?.({ id, timeRange: newTimeRange });
  };

  const handleAnalyticTypeChange = (types: AnalyticType[]) => {
    onUpdateCard?.({ id, analyticTypes: types });
  };

  const handleDisplayTypeChange = (type: StatisticsDisplayType) => {
    onUpdateCard?.({ id, displayType: type });
  };

  const handleShowLegendChange = (show: boolean) => {
    onUpdateCard?.({ id, showLegend: show });
  };

  const renderChart = () => {
    if (!data.chartData) return null;

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            padding: 15,
            font: {
              family: "'Quicksand', sans-serif",
              size: 10,
              weight: "normal" as const,
            },
            color: "#001126",
          },
        },
      },
      scales:
        displayType !== StatisticsDisplayType.PIE
          ? {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    family: "'Quicksand', sans-serif",
                    size: 10,
                    weight: "normal" as const,
                  },
                  color: "#001126",
                },
              },
              y: {
                beginAtZero: true,
                grid: { color: "#E2E8F0" },
                ticks: {
                  font: {
                    family: "'Quicksand', sans-serif",
                    size: 10,
                    weight: "normal" as const,
                  },
                  color: "#001126",
                },
              },
            }
          : undefined,
    };

    switch (displayType) {
      case StatisticsDisplayType.AREA:
        return (
          <Line
            data={{
              ...(data.chartData as ChartData<"line">),
              datasets: (data.chartData as ChartData<"line">).datasets.map(
                (dataset, index) => {
                  const ctx = document.createElement("canvas").getContext("2d");
                  if (!ctx) return dataset;

                  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                  const color = data.series[index].color;
                  gradient.addColorStop(0, `${color}CC`); // 80% opacity
                  gradient.addColorStop(0.15, `${color}99`); // 60% opacity
                  gradient.addColorStop(0.3, `${color}00`); // 0% opacity

                  return {
                    ...dataset,
                    fill: "origin",
                    tension: 0.4,
                    borderWidth: 1,
                    borderColor: color,
                    backgroundColor: gradient,
                  };
                }
              ),
            }}
            options={{
              ...baseOptions,
              maintainAspectRatio: false,
              aspectRatio: 14.4,
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
                      weight: 500 as const,
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
                      weight: 500 as const,
                    },
                    padding: 8,
                  },
                },
              },
              plugins: {
                ...baseOptions.plugins,
                legend: {
                  position: "top" as const,
                  align: "end" as const,
                  labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    padding: 15,
                    font: {
                      family: "'Quicksand', sans-serif",
                      size: 10,
                      weight: "normal" as const,
                    },
                    color: "#001126",
                  },
                },
              },
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
      case StatisticsDisplayType.BAR:
        return (
          <Bar
            data={data.chartData as ChartData<"bar">}
            options={baseOptions}
          />
        );
      case StatisticsDisplayType.PIE:
        return (
          <Pie
            data={data.chartData as ChartData<"pie">}
            options={baseOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`statistics-card-container flex flex-col flex-shrink-0 bg-[#F1F5F9] rounded-lg p-4 relative h-full shadow-[-1px_-1px_0px_0px_#FFF_inset,_-2px_-2px_2px_0px_#B8CCE0_inset,_-1px_-1px_0px_0px_#FFF,_-2px_-2px_2px_0px_#B8CCE0] ${className}`}
    >
      <div className="flex justify-between items-start gap-2 w-full">
        <div className="min-w-0 flex-1">
          <CardTitle
            title={title}
            isEditing={isEditing}
            onTitleChange={handleTitleChange}
            onStartEdit={() => setIsEditing(true)}
            onFinishEdit={() => setIsEditing(false)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") setIsEditing(false);
            }}
          />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <TimeRangeSelector
            timeRange={timeRange}
            isWide={isWide}
            onTimeRangeChange={handleTimeRangeChange}
            menuPosition={timeMenu}
            onMenuOpen={handleTimeClick}
            onMenuClose={() => setTimeMenu(null)}
          />
          <OptionsSelector
            menuPosition={optionsMenu}
            onMenuOpen={handleOptionsClick}
            onMenuClose={() => setOptionsMenu(null)}
            onDataOptionSelect={handleAnalyticTypeChange}
            onStatisticsTypeSelect={handleDisplayTypeChange}
            onShowLegendChange={handleShowLegendChange}
            selectedAnalyticTypes={analyticTypes}
            selectedDisplayType={displayType}
            showLegend={showLegend ?? false}
          />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center min-h-0">
        {displayType === StatisticsDisplayType.METRIC ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] w-full">
            <div
              ref={metricsRef}
              className="flex flex-wrap justify-center items-center gap-4 overflow-auto w-full p-2 max-h-full"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#E2E8F0 transparent",
              }}
            >
              {data.series.map((serie, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[120px]"
                >
                  <div className="text-[#001126] text-sm font-medium font-['Quicksand'] flex items-center gap-2">
                    {showLegend && (
                      <Fragment>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: serie.color }}
                        />
                        {serie.label}
                      </Fragment>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {serie.icon && getIcon(serie.icon)}
                    <span className="text-2xl font-bold">{serie.value}</span>
                  </div>
                  {data.trend && (
                    <span
                      className={`text-sm ${
                        data.trend.isPositive
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {data.trend.isPositive ? "+" : ""}
                      {data.trend.value}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};
