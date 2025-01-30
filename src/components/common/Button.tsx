import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "flex justify-center items-center font-quicksand text-base font-bold leading-none text-sofia-superDark";
  const variantStyles = {
    primary: "flex-1 p-4 bg-sofia-electricGreen rounded-lg",
    default: "flex-1 p-4 border border-sofia-navyBlue rounded-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
