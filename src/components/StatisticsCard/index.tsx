import { ReactNode } from "react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatisticsCard = ({
  title,
  value,
  icon,
  className = "",
  trend,
}: StatisticsCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 ${className}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm font-medium">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span
            className={`text-sm ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};
