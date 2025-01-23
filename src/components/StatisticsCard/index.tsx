import { useState, useRef, useEffect } from "react";
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
  title: string;
  analyticType: AnalyticType;
  displayType: StatisticsDisplayType;
  timeRange: TimeRange;
  className?: string;
  onUpdateCard?: (update: {
    title?: string;
    timeRange?: TimeRange;
    analyticType?: AnalyticType;
    displayType?: StatisticsDisplayType;
  }) => void;
}

export const StatisticsCard = ({
  title,
  analyticType,
  displayType,
  timeRange,
  className = "",
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

  const data = useAnalyticData(analyticType, displayType, timeRange);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        setIsWide(containerRef.current.offsetWidth >= 300);
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
    onUpdateCard?.({ title: newTitle });
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    onUpdateCard?.({ timeRange: newTimeRange });
  };

  const handleAnalyticTypeChange = (type: AnalyticType) => {
    onUpdateCard?.({ analyticType: type });
  };

  const handleDisplayTypeChange = (type: StatisticsDisplayType) => {
    onUpdateCard?.({ displayType: type });
  };

  const renderChart = () => {
    if (!data) return null;

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: displayType !== StatisticsDisplayType.METRIC,
          position: "bottom" as const,
        },
      },
      scales:
        displayType !== StatisticsDisplayType.PIE
          ? {
              x: {
                grid: { display: false },
              },
              y: {
                beginAtZero: true,
                grid: { color: "#E2E8F0" },
              },
            }
          : undefined,
    };

    switch (displayType) {
      case StatisticsDisplayType.AREA:
        return (
          <Line
            data={data.chartData as ChartData<"line">}
            options={baseOptions}
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
      case StatisticsDisplayType.METRIC:
      default:
        return (
          <div className="flex flex-col items-center h-[calc(100%-2rem)] w-full">
            <div
              ref={metricsRef}
              className="flex flex-wrap justify-center items-start gap-4 overflow-auto w-full p-2 h-full"
              style={{
                maxHeight: "100%",
                scrollbarWidth: "thin",
                scrollbarColor: "#E2E8F0 transparent",
              }}
            >
              {data.series.map((serie, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[120px]"
                >
                  <div className="text-[#001126] text-sm font-medium font-['Quicksand']">
                    {serie.label}
                  </div>
                  <div className="flex items-center gap-2">
                    {serie.icon ? (
                      getIcon(serie.icon)
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: serie.color }}
                      />
                    )}
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
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`statistics-card-container flex-shrink-0 bg-[#F1F5F9] rounded-lg p-4 relative h-full shadow-[-1px_-1px_0px_0px_#FFF_inset,_-2px_-2px_2px_0px_#B8CCE0_inset,_-1px_-1px_0px_0px_#FFF,_-2px_-2px_2px_0px_#B8CCE0] ${className}`}
    >
      <div className="flex justify-between items-start gap-2 w-full">
        <div className="min-w-0 flex-1">
          <CardTitle
            title={title}
            isEditing={isEditing}
            onTitleChange={handleTitleChange}
            onStartEdit={() => setIsEditing(true)}
            onFinishEdit={() => setIsEditing(false)}
            onKeyDown={e => {
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
            selectedAnalyticType={analyticType}
            selectedDisplayType={displayType}
          />
        </div>
      </div>

      <div className="flex justify-center items-center h-full pt-8">
        {renderChart()}
      </div>
    </div>
  );
};
