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
  width = "56px",
  height = "166px",
  className = "",
}: NeumorphicContainerProps) => {
  return (
    <div
      className={`
        flex
        bg-[#F1F5F9]
        rounded-[8px_8px_8px_8px]
        shadow-[-2px_-2px_2px_0px_#B8CCE0,-1px_-1px_0px_0px_#FFFFFF,-2px_-2px_2px_0px_#B8CCE0_inset,-1px_-1px_0px_0px_#FFFFFF_inset]
        justify-center
        items-center
        ${className}
      `}
      style={{
        width,
        height,
      }}
    >
      {children}
    </div>
  );
};
