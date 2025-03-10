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
    "flex justify-center items-center text-base font-normal leading-none";
  const variantStyles = {
    primary:
      "flex-1 h-[41px] px-4 py-2 bg-sofia-superDark text-sofia-blancoPuro rounded-lg disabled:bg-sofia-superDark/50 disabled:cursor-not-allowed",
    default:
      "flex-1 h-[41px] px-4 py-2 border text-sofia-superDark border-sofia-navyBlue rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
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
