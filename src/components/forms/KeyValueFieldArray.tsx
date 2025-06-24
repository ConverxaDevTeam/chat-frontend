import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Input } from "./input";
import { FaPlus, FaTrash } from "react-icons/fa";

export interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueFieldArrayProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  fields: { id: string }[];
  fieldName: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  label: string;
}

export const KeyValueFieldArray = <T extends FieldValues>({
  register,
  fields,
  fieldName,
  onAdd,
  onRemove,
  label,
}: KeyValueFieldArrayProps<T>) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
        >
          <FaPlus />
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr,1fr,auto] gap-2">
            <Input
              placeholder="Nombre"
              register={register(`${fieldName}.${index}.key` as Path<T>, {
                required: "El nombre del campo es requerido",
              })}
            />
            <Input
              placeholder="Valor"
              register={register(`${fieldName}.${index}.value` as Path<T>, {
                required: "El valor del campo es requerido",
              })}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors hover:bg-red-200"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
