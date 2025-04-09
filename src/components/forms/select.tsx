import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  rules?: Record<string, unknown>;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  className?: string;
}

export const Select = <T extends FieldValues>({
  name,
  control,
  options,
  rules,
  placeholder,
  error,
  disabled = false,
  onChange,
  onFocus,
  className = "",
}: SelectProps<T>) => {
  const [touched, setTouched] = useState(false);

  if (!control) {
    return null;
  }

  const getBorderClass = () => {
    if (error) return "border-red-500";
    if (touched) return "border-sofia-darkBlue";
    return "border-sofia-darkBlue";
  };

  return (
    <div className={`w-full ${className}`}>
      {placeholder && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {placeholder}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          // Usar fieldState para detectar errores desde react-hook-form
          const currentError = error || fieldState.error;
          return (
            <div className="relative">
              <select
                {...field}
                value={field.value ?? ""}
                disabled={disabled}
                className={`flex w-full px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border ${getBorderClass()} text-sofia-superDark text-[14px] font-normal leading-normal appearance-none bg-[url('/mvp/chevron-down.svg')] bg-no-repeat bg-[center_right_1rem] focus:outline-none focus:ring-0 ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
                onChange={e => {
                  field.onChange(e);
                  if (onChange) onChange(e.target.value);
                  setTouched(true);
                }}
                onFocus={() => {
                  if (onFocus) onFocus();
                }}
                onBlur={() => {
                  field.onBlur();
                  setTouched(true);
                }}
              >
                <option value="" disabled>
                  {placeholder || "Seleccionar una opción"}
                </option>
                {options.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="py-2 px-3"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {currentError && (
                <p className="mt-1 text-sm text-red-500">
                  {currentError.message}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Select;
