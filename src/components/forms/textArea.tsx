import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  placeholder?: string;
  register: UseFormRegisterReturn;
  label?: string;
  error?: string;
  className?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  register,
  error,
  className = "",
  rows = 4,
}) => {
  return (
    <textarea
      className={`flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal h-[100px] ${
        error ? "border-red-500" : ""
      } ${className}`}
      placeholder={placeholder}
      rows={rows}
      {...register}
    />
  );
};
