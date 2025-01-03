import { ReactNode } from "react";

interface NeumorphicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  withContainer?: boolean;
  width?: string;
  height?: string;
}

export const NeumorphicButton = ({
  children,
  onClick,
  withContainer = true,
  width = "128px",
  height = "128px",
}: NeumorphicButtonProps) => {
  const innerButton = (
    <div
      onClick={onClick}
      className={`
        w-[82px] h-[82px]
        p-6
        gap-2
        rounded-[24px]
        bg-[#F6F6F6]
        flex items-center justify-center
        shadow-[-8px_-8px_16px_0px_#FFFFFF,8px_8px_16px_0px_#C9D9E8]
      `}
    >
      {children}
    </div>
  );

  if (!withContainer) {
    return innerButton;
  }

  return (
    <div
      className={`
        bg-[#F6F6F6]
        rounded-[32px]
        flex items-center justify-center
        shadow-[-2px_-2px_2px_0px_#B8CCE0,-1px_-1px_0px_0px_#FFFFFF,-2px_-2px_2px_0px_#B8CCE0_inset,-1px_-1px_0px_0px_#FFFFFF_inset]
      `}
      style={{ width, height }}
    >
      {innerButton}
    </div>
  );
};
