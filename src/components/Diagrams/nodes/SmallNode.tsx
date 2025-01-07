import { ReactNode } from "react";

interface SmallNodeProps {
  children: ReactNode;
  className?: string;
}

export const SmallNode = ({ children, className = "" }: SmallNodeProps) => {
  return (
    <div
      className={`
        flex justify-center items-center
        w-[40px] h-[40px] p-2
        shrink-0
        rounded
        bg-sofia-celeste
        shadow-[8px_5px_16px_0px_#C9D9E8]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
