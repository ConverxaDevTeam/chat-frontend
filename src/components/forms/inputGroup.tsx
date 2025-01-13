import { FieldError, Merge } from "react-hook-form";

interface InputGroupProps {
  label: string;
  labelColor?: string;
  children: React.ReactNode;
  errors?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

export const InputGroup = ({
  label,
  children,
  errors,
  labelColor = "text-gray-600",
}: InputGroupProps) => {
  // Aseguramos que los errores sean un array de FieldError
  const errorMessages = Array.isArray(errors)
    ? errors.filter((error): error is FieldError => error !== undefined) // Filtramos los undefined
    : errors
      ? [errors]
      : [];

  return (
    <div>
      <label
        className={`block text-sm font-medium ${labelColor} text-left mb-1`}
      >
        {label}
      </label>
      {children}
      {errorMessages.length > 0 && (
        <div className="text-red-500 text-sm mt-1">
          {errorMessages.map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};
