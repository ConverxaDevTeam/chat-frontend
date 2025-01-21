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
    <div>
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
            value={field.value || ""} // Aseguramos un valor predeterminado si `value` es `undefined`
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="" disabled>
              {placeholder || "Seleccionar una opción"}
            </option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
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
