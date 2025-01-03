import { ReactNode } from "react";

interface NeumorphicContainerProps {
  children: ReactNode;
  width?: string;
  height?: string;
  className?: string;
  top?: string;
  left?: string;
  rotation?: string;
}

export const NeumorphicContainer = ({
  children,
  width = "3.5rem",
  height = "10.375rem",
  className = "",
  top,
  left,
  rotation = "0deg",
}: NeumorphicContainerProps) => {
  return (
    <div
      className={`
        bg-[#F1F5F9]
        rounded-lg
        shadow-[-0.125rem_-0.125rem_0.125rem_0px_#B8CCE0,-0.0625rem_-0.0625rem_0px_0px_#FFFFFF,-0.125rem_-0.125rem_0.125rem_0px_#B8CCE0_inset,-0.0625rem_-0.0625rem_0px_0px_#FFFFFF_inset]
        absolute
        ${className}
      `}
      style={{
        width,
        height,
        top,
        left,
        transform: `rotate(${rotation})`,
      }}
    >
      {children}
    </div>
  );
};
