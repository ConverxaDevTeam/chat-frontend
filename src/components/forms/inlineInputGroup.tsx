import { FieldError, Merge } from "react-hook-form";

interface InlineInputGroupProps {
  label: string;
  children: React.ReactNode;
  errors?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

export const InlineInputGroup = ({
  label,
  children,
  errors,
}: InlineInputGroupProps) => {
  // Aseguramos que los errores sean un array de FieldError
  const errorMessages = Array.isArray(errors)
    ? errors.filter((error): error is FieldError => error !== undefined) // Filtramos los undefined
    : errors
      ? [errors]
      : [];

  return (
    <div className="flex items-center gap-2 w-full">
      <label className="text-sofia-superDark text-[14px] font-[600] leading-[16px] whitespace-nowrap">
        {label}
      </label>
      <div className="flex-1">{children}</div>
      {errorMessages.length > 0 && (
        <div className="text-red-500 text-xs">
          {errorMessages.map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};
