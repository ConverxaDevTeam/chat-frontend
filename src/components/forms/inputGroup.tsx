import { FieldError, Merge } from "react-hook-form";

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
  errors?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
  tooltip?: React.ReactNode;
  description?: React.ReactNode;
}

export const InputGroup = ({
  label,
  children,
  errors,
  tooltip,
  description,
}: InputGroupProps) => {
  // Aseguramos que los errores sean un array de FieldError
  const errorMessages = Array.isArray(errors)
    ? errors.filter((error): error is FieldError => error !== undefined) // Filtramos los undefined
    : errors
      ? [errors]
      : [];

  return (
    <div className="flex flex-col items-start gap-3 self-stretch">
      <div className="flex items-start gap-2 group-re">
        <label className="text-sofia-superDark text-[16px] font-normal leading-[16px]">
          {label}
        </label>
        {description && (
          <p className="text-sofia-navyBlue text-[12px]">{description}</p>
        )}
        {tooltip}
      </div>
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
