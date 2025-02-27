import Modal from "@components/Modal";
import {
  ParamType,
  ObjectParamProperty,
} from "@interfaces/function-params.interface";
import { useCallback, useMemo, useEffect } from "react";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { Select } from "@components/forms/select";
import {
  useForm,
  UseFormRegister,
  FieldErrors,
  Control,
  useWatch,
} from "react-hook-form";
import { Button } from "@components/common/Button";
import { JsonStructureEditor } from "./JsonStructureEditor";

// Types
export interface JsonField {
  key: string;
  type: string;
  required: boolean;
  description?: string;
  properties?: ObjectParamProperty[];
}

interface JsonFieldFormModalProps {
  isShown: boolean;
  onClose: () => void;
  field?: JsonField | null;
  onSubmit: (field: JsonField) => void;
}

interface JsonFieldFormFieldsProps {
  register: UseFormRegister<JsonField>;
  control: Control<JsonField>;
  errors: FieldErrors<JsonField>;
  onClose: () => void;
}

// Form Hook
const useJsonFieldForm = (initialField?: JsonField | null) => {
  const defaultValues = useMemo(
    () => ({
      key: "",
      type: ParamType.STRING,
      description: "",
      required: false,
      properties: [],
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<JsonField>({
    defaultValues,
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  useEffect(() => {
    if (initialField) {
      reset({
        key: initialField.key,
        type: initialField.type as ParamType,
        description: initialField.description || "",
        required: initialField.required || false,
        properties: initialField.properties || [],
      });
    } else {
      resetForm();
    }
  }, [initialField, reset, resetForm]);

  return {
    register,
    handleSubmit,
    control,
    errors,
    resetForm,
  };
};

// Form Fields Component
const JsonFieldFormFields = ({
  register,
  control,
  errors,
  onClose,
}: JsonFieldFormFieldsProps) => {
  const type = useWatch({ control, name: "type" });

  return (
    <div className="flex flex-col gap-[24px]">
      <InputGroup label="Nombre" errors={errors.key}>
        <Input
          placeholder="Nombre del campo"
          register={register("key", { required: "El nombre es obligatorio" })}
          error={errors.key?.message}
        />
      </InputGroup>

      <InputGroup label="Tipo" errors={errors.type}>
        <Select
          name="type"
          control={control}
          options={Object.values(ParamType).map(type => ({
            value: type,
            label: type,
          }))}
          placeholder="Seleccionar tipo"
        />
      </InputGroup>

      {type === ParamType.OBJECT && (
        <InputGroup label="Estructura">
          <JsonStructureEditor
            value={[]}
            onChange={(fields: JsonField[]) => {
              // Aquí manejar el cambio de campos
            }}
            onCloseMainModal={onClose}
          />
        </InputGroup>
      )}
      <InputGroup label="Descripción" errors={errors.description}>
        <TextArea
          placeholder="Descripción del campo"
          register={register("description")}
          error={errors.description?.message}
          rows={3}
        />
      </InputGroup>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("required")}
          className="h-4 w-4 rounded border-gray-300 accent-sofia-electricOlive"
        />
        <label className="ml-2 text-sofia-superDark text-[14px] font-semibold leading-[16px]">
          Requerido
        </label>
      </div>
    </div>
  );
};

// Form Actions Component
const JsonFieldFormActions = ({
  isEdit,
  disabled = false,
}: {
  isEdit: boolean;
  disabled?: boolean;
}) => (
  <Button
    type="submit"
    variant="primary"
    className="w-full"
    disabled={disabled}
  >
    {isEdit ? "Actualizar campo" : "Agregar campo"}
  </Button>
);

// Main Component
export const JsonFieldFormModal = ({
  isShown,
  onClose,
  field,
  onSubmit,
}: JsonFieldFormModalProps) => {
  const { register, handleSubmit, control, errors, resetForm } =
    useJsonFieldForm(field);

  const onFormSubmit = useCallback(
    handleSubmit(data => {
      onSubmit(data);
      resetForm();
      onClose();
    }),
    [handleSubmit, onSubmit, resetForm, onClose]
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  useEffect(() => {
    if (!isShown) {
      resetForm();
    }
  }, [isShown, resetForm]);

  const modalHeader = useMemo(
    () => (
      <h2 className="text-xl font-semibold">
        {field ? "Editar Campo" : "Nuevo Campo"}
      </h2>
    ),
    [field]
  );

  return (
    <Modal isShown={isShown} onClose={handleClose} header={modalHeader}>
      <form onSubmit={onFormSubmit} className="space-y-4 w-[475px]">
        <JsonFieldFormFields
          register={register}
          control={control}
          errors={errors}
          onClose={handleClose}
        />
        <JsonFieldFormActions isEdit={!!field} />
      </form>
    </Modal>
  );
};
