import { FieldError } from "react-hook-form";

interface InputGroupProps {
  label: string;
  labelColor?: string;
  children: React.ReactNode;
  errors?: FieldError;
}

export const InputGroup = ({
  label,
  children,
  errors,
  labelColor = "text-gray-600",
}: InputGroupProps) => {
  return (
    <div>
      <label
        className={`block text-sm font-medium ${labelColor} text-left mb-1`}
      >
        {label}
      </label>
      {children}
      {errors && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
    </div>
  );
};
