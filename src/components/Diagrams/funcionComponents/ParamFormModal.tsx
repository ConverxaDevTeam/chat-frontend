import Modal from "@components/Modal";
import {
  CreateFunctionParamDto,
  FunctionParam,
  ParamType,
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
} from "react-hook-form";
import { Button } from "@components/common/Button";

// Types
interface ParamFormModalProps {
  isShown: boolean;
  onClose: () => void;
  param?: FunctionParam | null;
  onSubmit: (param: CreateFunctionParamDto) => void;
}

interface ParamFormFieldsProps {
  register: UseFormRegister<CreateFunctionParamDto>;
  control: Control<CreateFunctionParamDto>;
  errors: FieldErrors<CreateFunctionParamDto>;
}

// Form Hook
const useParamForm = (initialParam?: FunctionParam | null) => {
  const defaultValues = useMemo(
    () => ({
      name: "",
      type: ParamType.STRING,
      description: "",
      required: false,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateFunctionParamDto>({
    defaultValues,
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  useEffect(() => {
    if (initialParam) {
      reset({
        name: initialParam.name,
        type: initialParam.type,
        description: initialParam.description || "",
        required: initialParam.required || false,
      });
    } else {
      resetForm();
    }
  }, [initialParam, reset, resetForm]);

  return {
    register,
    handleSubmit,
    control,
    errors,
    resetForm,
  };
};

// Form Fields Component
const ParamFormFields = ({
  register,
  control,
  errors,
}: ParamFormFieldsProps) => (
  <div className="flex flex-col gap-[24px]">
    <InputGroup label="Nombre" errors={errors.name}>
      <Input
        placeholder="Nombre del parámetro"
        register={register("name", { required: "El nombre es obligatorio" })}
        error={errors.name?.message}
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

    <InputGroup label="Descripción" errors={errors.description}>
      <TextArea
        placeholder="Descripción del parámetro"
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

// Form Actions Component
const ParamFormActions = ({
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
    {isEdit ? "Actualizar parámetro" : "Crear parámetro"}
  </Button>
);

// Main Component
export const ParamFormModal = ({
  isShown,
  onClose,
  param,
  onSubmit,
}: ParamFormModalProps) => {
  const { register, handleSubmit, control, errors, resetForm } =
    useParamForm(param);

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
        {param ? "Editar Parámetro" : "Nuevo Parámetro"}
      </h2>
    ),
    [param]
  );

  return (
    <Modal isShown={isShown} onClose={handleClose} header={modalHeader}>
      <form onSubmit={onFormSubmit} className="space-y-4 w-[475px]">
        <ParamFormFields
          register={register}
          control={control}
          errors={errors}
        />
        <ParamFormActions isEdit={!!param} />
      </form>
    </Modal>
  );
};
