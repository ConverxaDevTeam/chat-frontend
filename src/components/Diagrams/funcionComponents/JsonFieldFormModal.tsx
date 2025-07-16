import Modal from "@components/Modal";
import {
  ParamType,
  ObjectParamProperty,
} from "@interfaces/function-params.interface";
import { useCallback, useMemo, useState, useEffect } from "react";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { Button } from "@components/common/Button";
import { useForm, Controller } from "react-hook-form";

// Types
interface JsonFieldFormModalProps {
  isShown: boolean;
  onClose: () => void;
  field: ObjectParamProperty;
  onSubmit: (field: ObjectParamProperty) => void;
}

// Main Component
export const JsonFieldFormModal = ({
  isShown,
  onClose,
  field,
  onSubmit,
}: JsonFieldFormModalProps) => {
  const [formState, setFormState] = useState<ObjectParamProperty>(field);

  // Form setup with correct default values
  const { control, setValue } = useForm({
    defaultValues: {
      name: field.name || "",
      fieldType: field.type || ParamType.STRING,
      description: field.description || "",
      required: field.required || false,
    },
  });

  // Actualizar el estado cuando cambia el campo
  useEffect(() => {
    // Field being edited
    setFormState(field);
    setValue("name", field.name || "");
    setValue("fieldType", field.type || ParamType.STRING);
    setValue("description", field.description || "");
    setValue("required", field.required || false);
  }, [field, setValue]);

  const handleChange = useCallback((newState: Partial<ObjectParamProperty>) => {
    setFormState(prev => ({ ...prev, ...newState }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(formState);
    onClose();
  }, [formState, onSubmit, onClose]);

  const modalHeader = useMemo(
    () => (
      <h2 className="text-xl font-semibold">
        {formState.name ? "Editar Campo" : "Nuevo Campo"}
      </h2>
    ),
    [formState.name]
  );

  return (
    <Modal isShown={isShown} onClose={onClose} header={modalHeader}>
      <div className="space-y-4 w-[475px]">
        <div className="flex flex-col gap-[24px]">
          <InputGroup label="Nombre">
            <Input
              placeholder="Nombre del campo"
              value={formState.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({ name: e.target.value })
              }
            />
          </InputGroup>

          <InputGroup label="Tipo">
            <Controller
              name="fieldType"
              control={control}
              render={({ field: controlField }) => (
                <select
                  {...controlField}
                  value={formState.type}
                  onChange={e => {
                    const newType = e.target.value as ParamType;
                    controlField.onChange(newType);
                    handleChange({ type: newType });
                  }}
                  className="flex w-full px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-lg border border-app-darkBlue text-app-superDark text-[14px] font-normal leading-normal appearance-none bg-[url('/mvp/chevron-down.svg')] bg-no-repeat bg-[center_right_1rem] focus:outline-none focus:ring-0 focus:border-app-darkBlue"
                >
                  <option value="" disabled>
                    Seleccionar tipo
                  </option>
                  {Object.values(ParamType).map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              )}
            />
          </InputGroup>

          <InputGroup label="Descripción">
            <textarea
              placeholder="Descripción del campo"
              value={formState.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange({ description: e.target.value })
              }
              rows={3}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </InputGroup>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formState.required || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange({ required: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 accent-app-electricOlive"
            />
            <label className="ml-2 text-app-superDark text-[14px] font-semibold leading-[16px]">
              Requerido
            </label>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          {formState.name ? "Actualizar campo" : "Agregar campo"}
        </Button>
      </div>
    </Modal>
  );
};
