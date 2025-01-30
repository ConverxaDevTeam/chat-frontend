import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  name: Path<T>; // Asegura que el nombre sea válido dentro del tipo de formulario
  control: Control<T, unknown>; // Usa el tipo del formulario genérico
  options: Option[];
  rules?: Record<string, unknown>;
  placeholder?: string;
}

export const Select = <T extends FieldValues>({
  name,
  control,
  options,
  rules,
  placeholder,
}: SelectProps<T>) => {
  if (!control) {
    return null;
  }
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">
        {placeholder}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <select
            {...field}
            value={field.value || ""}
            className="flex w-full px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-lg border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal appearance-none bg-[url('/mvp/chevron-down.svg')] bg-no-repeat bg-[center_right_1rem] focus:outline-none focus:ring-0 focus:border-sofia-darkBlue"
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
        )}
      />
    </div>
  );
};

export default Select;
