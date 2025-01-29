import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  className?: string;
  type?: "text" | "email" | "password" | "number";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      register,
      error,
      className = "",
      type = "text",
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        className={`flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-lg border border-sofia-darkBlue text-sofia-superDark font-quicksand text-[14px] font-normal leading-normal ${
          error ? "border-red-500" : ""
        } ${disabled ? "bg-gray-200" : ""} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        ref={ref}
        {...(register && { ...register })}
        {...props}
      />
    );
  }
);
