import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  fullWidth = false,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "flex justify-center items-center font-quicksand text-base font-bold leading-none text-sofia-superDark";
  const variantStyles = {
    primary: "w-[470px] h-[48px] py-4 px-0 bg-sofia-electricGreen rounded-lg",
    default: "flex-1 p-4 border border-sofia-navyBlue rounded-lg",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
