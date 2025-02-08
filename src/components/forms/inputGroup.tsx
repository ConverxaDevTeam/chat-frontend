import { FieldError, Merge } from "react-hook-form";

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
  errors?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

export const InputGroup = ({ label, children, errors }: InputGroupProps) => {
  // Aseguramos que los errores sean un array de FieldError
  const errorMessages = Array.isArray(errors)
    ? errors.filter((error): error is FieldError => error !== undefined) // Filtramos los undefined
    : errors
      ? [errors]
      : [];

  return (
    <div className="flex flex-col items-start gap-2 self-stretch">
      <label className="text-sofia-superDark text-[14px] font-[600] leading-[16px]">
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
