import { ReactNode, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { FaEdit } from "react-icons/fa";

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

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setCardTitle(e.target.value);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex-shrink-0 bg-[#F1F5F9] rounded-lg p-4 relative h-full shadow-[-1px_-1px_0px_0px_#FFF_inset,_-2px_-2px_2px_0px_#B8CCE0_inset,_-1px_-1px_0px_0px_#FFF,_-2px_-2px_2px_0px_#B8CCE0] ${className}`}
    >
      <div
        className="absolute top-4 left-4 min-w-[200px] z-10"
        onMouseDown={handleMouseDown}
      >
        {isEditing ? (
          <input
            type="text"
            value={cardTitle}
            onChange={e => setCardTitle(e.target.value)}
            onKeyDown={handleTitleChange}
            onBlur={handleTitleBlur}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            className="text-[#001126] font-quicksand text-base font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 min-w-[120px]"
            autoFocus
          />
        ) : (
          <div
            onClick={handleTitleClick}
            onMouseDown={handleMouseDown}
            className="flex items-center gap-2 p-2 -m-2 rounded hover:bg-white/50 cursor-pointer group select-none"
          >
            <span className="text-[#001126] font-quicksand text-base font-semibold group-hover:text-[#001126]/80">
              {cardTitle}
            </span>
            <FaEdit className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
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
