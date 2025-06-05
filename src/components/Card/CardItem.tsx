import { FC, ReactNode } from "react";

interface CardItemProps {
  label?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CardItem: FC<CardItemProps> = ({ label, children, className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <span className="text-xs text-gray-500 mb-1">{label}</span>}
      <span className={`${sizeClasses[size]} text-gray-900`}>{children}</span>
    </div>
  );
};

export default CardItem;
