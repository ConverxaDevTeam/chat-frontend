import { UseFormRegisterReturn } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  className?: string;
}

export const Select = ({
  options,
  register,
  error,
  placeholder,
  className = "",
}: SelectProps) => {
  return (
    <select
      {...register}
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
        error
          ? "ring-red-300 focus:ring-red-500"
          : "ring-gray-300 focus:ring-blue-500"
      } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
