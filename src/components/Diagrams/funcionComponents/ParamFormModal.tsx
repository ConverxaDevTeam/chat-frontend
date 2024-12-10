import Modal from "@components/Modal";
import {
  CreateFunctionParamDto,
  FunctionParam,
  ParamType,
} from "@interfaces/function-params.interface";
import { useCallback } from "react";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";

// Types
interface ParamFormModalProps {
  isShown: boolean;
  onClose: () => void;
  param?: FunctionParam | null;
  onSubmit: (param: CreateFunctionParamDto) => void;
}

interface ParamFormFieldsProps {
  register: UseFormRegister<CreateFunctionParamDto>;
  errors: FieldErrors<CreateFunctionParamDto>;
}

// Form Hook
const useParamForm = (initialParam?: FunctionParam | null) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFunctionParamDto>({
    defaultValues: {
      name: initialParam?.name || "",
      type: initialParam?.type || ParamType.STRING,
      description: initialParam?.description || "",
      required: initialParam?.required || false,
    },
  });

  const resetForm = useCallback(() => {
    reset({
      name: "",
      type: ParamType.STRING,
      description: "",
      required: false,
    });
  }, [reset]);

  return {
    register,
    handleSubmit,
    errors,
    resetForm,
  };
};

// Form Fields Component
const ParamFormFields = ({ register, errors }: ParamFormFieldsProps) => (
  <>
    <InputGroup label="Nombre" errors={errors.name}>
      <Input
        placeholder="Nombre del parámetro"
        register={register("name", { required: "El nombre es obligatorio" })}
        error={errors.name?.message}
      />
    </InputGroup>

    <InputGroup label="Tipo" errors={errors.type}>
      <select
        {...register("type")}
        className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
      >
        {Object.values(ParamType).map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
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
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label className="ml-2 block text-sm text-gray-900">Requerido</label>
    </div>
  </>
);

// Form Actions Component
const ParamFormActions = ({
  onClose,
  isEdit,
  disabled = false,
}: {
  onClose: () => void;
  isEdit: boolean;
  disabled?: boolean;
}) => (
  <div className="flex justify-end space-x-2">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      disabled={disabled}
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
      disabled={disabled}
    >
      {isEdit ? "Actualizar" : "Crear"}
    </button>
  </div>
);

// Main Component
export const ParamFormModal = ({
  isShown,
  onClose,
  param,
  onSubmit,
}: ParamFormModalProps) => {
  const { register, handleSubmit, errors, resetForm } = useParamForm(param);

  const onFormSubmit = handleSubmit(data => {
    onSubmit(data);
    resetForm();
    onClose();
  });

  return (
    <Modal
      isShown={isShown}
      onClose={onClose}
      header={
        <h2 className="text-xl font-semibold">
          {param ? "Editar Parámetro" : "Nuevo Parámetro"}
        </h2>
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <ParamFormFields register={register} errors={errors} />
        <ParamFormActions onClose={onClose} isEdit={!!param} />
      </form>
    </Modal>
  );
};
