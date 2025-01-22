import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { IoEllipsisVertical } from "react-icons/io5";
import { TimeRange } from "./types";
import { CardTitle } from "./CardTitle";
import { TimeRangeSelector } from "./TimeRangeSelector";

interface StatisticsCardProps {
  id: string;
  defaultTitle: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatisticsCard = ({
  id,
  defaultTitle,
  value,
  icon,
  className = "",
  trend,
}: StatisticsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardTitle, setCardTitle] = useLocalStorage(
    `card-title-${id}`,
    defaultTitle
  );
  const [timeRange, setTimeRange] = useLocalStorage<TimeRange>(
    `card-timerange-${id}`,
    "30d"
  );
  const [timeMenu, setTimeMenu] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isWide, setIsWide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const rect = e.currentTarget.getBoundingClientRect();
    const card = (e.currentTarget as HTMLElement).closest(
      ".statistics-card-container"
    ) as HTMLElement;
    const cardRect = card.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setTimeMenu({
      x: rect.left - cardRect.left,
      y: rect.bottom + scrollTop - (cardRect.top + scrollTop) + 4,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`statistics-card-container flex-shrink-0 bg-[#F1F5F9] rounded-lg p-4 relative h-full shadow-[-1px_-1px_0px_0px_#FFF_inset,_-2px_-2px_2px_0px_#B8CCE0_inset,_-1px_-1px_0px_0px_#FFF,_-2px_-2px_2px_0px_#B8CCE0] ${className}`}
    >
      <div className="flex justify-between items-start gap-2 w-full">
        <div className="min-w-0 flex-1">
          <CardTitle
            title={cardTitle}
            isEditing={isEditing}
            onTitleChange={setCardTitle}
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
            onTimeRangeChange={setTimeRange}
            menuPosition={timeMenu}
            onMenuOpen={handleTimeClick}
            onMenuClose={() => setTimeMenu(null)}
          />
          <button className="p-1.5 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
            <IoEllipsisVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center h-full pt-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-end w-full">
            {icon && <div className="text-gray-400">{icon}</div>}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <span
                className={`text-sm ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
