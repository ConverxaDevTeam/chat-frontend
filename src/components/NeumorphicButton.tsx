import { ReactNode } from "react";

interface ExternalNeumorphicButtonProps {
  radius?: string;
  backgroundColor?: string;
  className?: string;
}

interface InternalNeumorphicButtonProps {
  radius?: string;
  backgroundColor?: string;
  className?: string;
}

interface NeumorphicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  withContainer?: boolean;
  width?: string;
  height?: string;
  innerWidth?: string;
  innerHeight?: string;
  innerPadding?: string;
  externalProps?: ExternalNeumorphicButtonProps;
  internalProps?: InternalNeumorphicButtonProps;
}

export const NeumorphicButton = ({
  children,
  onClick,
  withContainer = true,
  width = "128px",
  height = "128px",
  innerWidth = "82px",
  innerHeight = "82px",
  externalProps = {
    radius: "[32px]",
    className: "",
  },
  internalProps = {
    radius: "[24px]",
    backgroundColor: "[#F1F5F9]",
    className: "",
  },
}: NeumorphicButtonProps) => {
  const innerButton = (
    <div
      onClick={onClick}
      className={`
        w-[${innerWidth}] h-[${innerHeight}]
        gap-2
        rounded-${internalProps?.radius}
        bg-${internalProps?.backgroundColor}
        flex items-center justify-center
        shadow-[-8px_-8px_16px_0px_#FFFFFF,8px_8px_16px_0px_#C9D9E8]
        ${internalProps?.className}
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
        bg-[#F1F5F9]
        rounded-${externalProps?.radius}
        flex items-center justify-center
        shadow-[-2px_-2px_2px_0px_#B8CCE0,-1px_-1px_0px_0px_#FFFFFF,-2px_-2px_2px_0px_#B8CCE0_inset,-1px_-1px_0px_0px_#FFFFFF_inset]
        ${externalProps?.className}
      `}
      style={{ width, height }}
    >
      {innerButton}
    </div>
  );
};
