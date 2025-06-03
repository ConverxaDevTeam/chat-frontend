import { useState, useRef, useEffect, Fragment } from "react";
import { CardTitle } from "./CardTitle";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { OptionsSelector } from "./OptionsSelector";
import { ChartData, ChartTypeRegistry } from "chart.js";
import { AreaChart } from "./components/AreaChart";
import { BarChart } from "./components/BarChart";
import { PieChart } from "./components/PieChart";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "../../services/analyticTypes";
import { useAnalyticData, AnalyticResult } from "../../hooks/useAnalyticData";
import "../../config/chartConfig";

interface SerieProps {
  color?: string;
  label: string;
  icon?: string;
}

const LegendView = ({ color, label, icon }: SerieProps) => {
  if (icon)
    return (
      <img
        src={`/mvp/${icon}.svg`}
        alt={icon}
        className="w-[24px] h-[24px] rounded-full"
      />
    );
  return (
    <Fragment>
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </Fragment>
  );
};

interface MetricsViewProps {
  data: {
    series: Array<{
      label: string;
      value: number;
      color?: string;
      icon?: string;
    }>;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  };
  showLegend?: boolean;
  metricsRef: React.RefObject<HTMLDivElement>;
}

const MetricsView = ({ data, showLegend, metricsRef }: MetricsViewProps) => (
  <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] w-full">
    <div
      ref={metricsRef}
      className="flex flex-wrap justify-center items-center gap-4 overflow-auto w-full p-2 max-h-full"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#E2E8F0 transparent",
      }}
    >
      {data.series.length > 0 ? (
        data.series.map((serie, index) => (
          <div key={index} className="flex flex-col items-center min-w-[120px]">
            <div className="text-[#001126] text-sm font-medium font-['Quicksand'] flex items-center gap-2">
              {showLegend && (
                <LegendView
                  color={serie.color}
                  label={serie.label}
                  icon={serie.icon}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{serie.value}</span>
            </div>
            {data.trend && (
              <span
                className={`text-sm ${
                  data.trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.trend.isPositive ? "+" : ""}
                {data.trend.value}%
              </span>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <span className="text-lg font-medium">No hay datos disponibles</span>
          <span className="text-sm">
            Intenta seleccionar otro rango de fechas
          </span>
        </div>
      )}
    </div>
  </div>
);

interface ChartViewProps {
  data: {
    chartData?: ChartData<keyof ChartTypeRegistry>;
    series: Array<{
      label: string;
      value: number;
      color?: string;
      icon?: string;
    }>;
  };
  displayType: StatisticsDisplayType;
  showLegend?: boolean;
}

const ChartView = ({ data, displayType, showLegend }: ChartViewProps) => {
  if (!data.chartData) return null;

  const chartSeries = data.series.map(s => ({ color: s.color || "#000000" }));

  switch (displayType) {
    case StatisticsDisplayType.AREA:
      return (
        <AreaChart
          data={data.chartData as ChartData<"line">}
          series={chartSeries}
          showLegend={showLegend}
        />
      );
    case StatisticsDisplayType.BAR:
      return (
        <BarChart
          data={data.chartData as ChartData<"bar">}
          series={chartSeries}
          showLegend={showLegend}
        />
      );
    case StatisticsDisplayType.PIE:
      return (
        <PieChart
          data={data.chartData as ChartData<"pie">}
          series={chartSeries}
          showLegend={showLegend}
        />
      );
    default:
      return null;
  }
};

const useCardWidth = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [isWide, setIsWide] = useState(false);

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

  return isWide;
};

const useMenuPosition = () => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (position !== null) {
      setPosition(null);
      return;
    }

    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();

    setPosition({
      x: buttonRect.x,
      y: buttonRect.y + buttonRect.height + 4,
    });
  };

  return { position, setPosition, handleMenuClick };
};

const CardHeader: React.FC<{
  title: string;
  isEditing: boolean;
  onTitleChange: (title: string) => void;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}> = ({
  title,
  isEditing,
  onTitleChange,
  onStartEdit,
  onFinishEdit,
  onKeyDown,
}) => (
  <div className="min-w-0 flex-1">
    <CardTitle
      title={title}
      isEditing={isEditing}
      onTitleChange={onTitleChange}
      onStartEdit={onStartEdit}
      onFinishEdit={onFinishEdit}
      onKeyDown={onKeyDown}
    />
  </div>
);

const CardContent: React.FC<{
  displayType: StatisticsDisplayType;
  data: AnalyticResult | null;
  showLegend?: boolean;
  metricsRef: React.RefObject<HTMLDivElement>;
}> = ({ displayType, data, showLegend, metricsRef }) => (
  <div className="flex-1 flex justify-center items-center min-h-0">
    {displayType === StatisticsDisplayType.METRIC && data ? (
      <MetricsView
        data={data}
        showLegend={showLegend}
        metricsRef={metricsRef}
      />
    ) : data?.chartData ? (
      <ChartView
        data={data}
        displayType={displayType}
        showLegend={showLegend}
      />
    ) : null}
  </div>
);

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
  onDeleteCard?: (cardId: number) => void;
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
  onDeleteCard,
}: StatisticsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const containerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const timeMenu = useMenuPosition();
  const optionsMenu = useMenuPosition();
  const isWide = useCardWidth(containerRef);
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const data = useAnalyticData(analyticTypes, displayType, timeRange);

  const handleTitleChange = (newTitle: string) => {
    setLocalTitle(newTitle);

    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }

    titleTimeoutRef.current = setTimeout(() => {
      onUpdateCard?.({ id, title: newTitle });
    }, 500);
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

  const renderContent = () => {
    if (!analyticTypes?.length) {
      return (
        <div className="text-gray-500">
          Selecciona al menos un tipo de analítica
        </div>
      );
    }

    if (!data) {
      return <div className="text-gray-500">No hay datos disponibles</div>;
    }

    return (
      <CardContent
        displayType={displayType}
        data={data}
        showLegend={showLegend}
        metricsRef={metricsRef}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`statistics-card-container h-full w-full bg-[#F1F5F9] rounded-lg p-4 relative shadow-[-1px_-1px_0px_0px_#FFF_inset,_-2px_-2px_2px_0px_#B8CCE0_inset,_-1px_-1px_0px_0px_#FFF,_-2px_-2px_2px_0px_#B8CCE0] overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex justify-between items-start gap-2 w-full">
        <CardHeader
          title={localTitle}
          isEditing={isEditing}
          onTitleChange={handleTitleChange}
          onStartEdit={() => setIsEditing(true)}
          onFinishEdit={() => {
            setIsEditing(false);
            if (localTitle !== title) {
              onUpdateCard?.({ id, title: localTitle });
            }
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              setIsEditing(false);
              if (localTitle !== title) {
                onUpdateCard?.({ id, title: localTitle });
              }
            }
          }}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <TimeRangeSelector
            timeRange={timeRange}
            isWide={isWide}
            onTimeRangeChange={handleTimeRangeChange}
            menuPosition={timeMenu.position}
            onMenuOpen={timeMenu.handleMenuClick}
            onMenuClose={() => timeMenu.setPosition(null)}
          />
          <OptionsSelector
            menuPosition={optionsMenu.position}
            onMenuOpen={optionsMenu.handleMenuClick}
            onMenuClose={() => optionsMenu.setPosition(null)}
            onDataOptionSelect={handleAnalyticTypeChange}
            onStatisticsTypeSelect={handleDisplayTypeChange}
            onShowLegendChange={handleShowLegendChange}
            selectedAnalyticTypes={analyticTypes}
            selectedDisplayType={displayType}
            showLegend={showLegend ?? false}
            cardId={id}
            onDeleteCard={onDeleteCard}
          />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
    </div>
  );
};
