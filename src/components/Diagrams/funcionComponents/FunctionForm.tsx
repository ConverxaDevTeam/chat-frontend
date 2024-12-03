import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { Select } from "@components/forms/select";
import { useState } from "react";
import {
  HttpMethod,
  HttpRequestFunction,
  FunctionData,
  FunctionNodeTypes,
} from "@interfaces/functions.interface";

// Tipos y constantes
interface FunctionFormValues {
  name: string;
  description: string;
  url: string;
  method: HttpMethod;
}

interface FunctionFormProps {
  functionId?: number;
  initialData?: FunctionData<HttpRequestFunction>;
  onSuccess?: (data: FunctionData<HttpRequestFunction>) => void;
  isLoading?: boolean;
}

const HTTP_METHODS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

// Hook personalizado para manejar el formulario
const useFunctionForm = (props: FunctionFormProps) => {
  const {
    functionId,
    initialData,
    onSuccess,
    isLoading: externalLoading,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !functionId;

  const form = useForm<FunctionFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      url: initialData?.config?.url || "",
      method: initialData?.config?.method || HttpMethod.GET,
    },
  });

  const onSubmit: SubmitHandler<FunctionFormValues> = async formData => {
    if (externalLoading) return;
    setIsLoading(true);
    try {
      const functionData: FunctionData<HttpRequestFunction> = {
        functionId,
        name: formData.name,
        description: formData.description,
        type: FunctionNodeTypes.API_ENDPOINT,
        config: {
          url: formData.url,
          method: formData.method,
          requestBody: initialData?.config?.requestBody || [],
        },
      };

      onSuccess?.(functionData);
    } catch (error) {
      console.error("Error saving function:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading: isLoading || externalLoading,
    isCreating,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

// Tipos para los campos del formulario
type FieldType = "input" | "textarea" | "select";

interface BaseFieldProps {
  name: keyof FunctionFormValues;
  placeholder: string;
  validation?: Record<string, unknown>;
}

interface InputFieldProps extends BaseFieldProps {
  type: "input";
}

interface TextAreaFieldProps extends BaseFieldProps {
  type: "textarea";
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  options: { value: string; label: string }[];
}

type FormFieldConfig = InputFieldProps | TextAreaFieldProps | SelectFieldProps;

// Componentes de formulario
interface FormFieldProps {
  register: UseFormRegister<FunctionFormValues>;
  errors: FieldErrors<FunctionFormValues>;
  name: keyof FunctionFormValues;
  placeholder: string;
  validation?: Record<string, unknown>;
  type?: FieldType;
  options?: { value: string; label: string }[];
  value?: string;
  rows?: number;
}

const RenderField = ({
  register,
  errors,
  name,
  placeholder,
  validation = {},
  type = "input",
  options = [],
  rows = 2,
}: FormFieldProps) => {
  switch (type) {
    case "textarea":
      return (
        <TextArea
          placeholder={placeholder}
          register={register(name, validation)}
          error={errors[name]?.message}
          rows={rows}
        />
      );
    case "select":
      return (
        <Select
          options={options}
          register={register(name, validation)}
          error={errors[name]?.message}
        />
      );
    default:
      return (
        <Input
          placeholder={placeholder}
          register={register(name, validation)}
          error={errors[name]?.message}
        />
      );
  }
};

const FormField = ({
  register,
  errors,
  name,
  placeholder,
  validation = {},
  type = "input",
  options = [],
  rows = 2,
}: FormFieldProps) => {
  return (
    <InputGroup label={name} errors={errors[name]}>
      <RenderField
        register={register}
        errors={errors}
        name={name}
        placeholder={placeholder}
        validation={validation}
        type={type}
        options={options}
        rows={rows}
      />
    </InputGroup>
  );
};

// Componente de botón de submit
interface SubmitButtonProps {
  isLoading: boolean;
  isCreating: boolean;
}

const SubmitButton = ({ isLoading, isCreating }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isLoading}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
  >
    {isLoading
      ? "Guardando..."
      : isCreating
        ? "Crear función"
        : "Actualizar función"}
  </button>
);

// Componente principal
export const FunctionForm = (props: FunctionFormProps) => {
  const {
    form: {
      register,
      formState: { errors },
    },
    isLoading,
    isCreating,
    onSubmit,
  } = useFunctionForm(props);

  const formFields = [
    {
      name: "name",
      placeholder: "Nombre de la función",
      validation: { required: "El nombre es obligatorio" },
      type: "input",
    },
    {
      name: "description",
      placeholder: "Descripción de la función",
      validation: { required: "La descripción es obligatoria" },
      type: "textarea",
      rows: 3,
    },
    {
      name: "url",
      placeholder: "URL del endpoint",
      validation: {
        required: "La URL es obligatoria",
        pattern: {
          value: /^https?:\/\/.+/,
          message:
            "Debe ser una URL válida que comience con http:// o https://",
        },
      },
      type: "input",
    },
    {
      name: "method",
      placeholder: "",
      validation: { required: "El tipo de operación es obligatorio" },
      type: "select",
      options: HTTP_METHODS,
    },
  ];

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="max-h-[75vh] overflow-y-auto">
        {formFields.map(field => (
          <FormField
            key={field.name}
            register={register}
            errors={errors}
            {...field}
          />
        ))}
      </div>

      <SubmitButton isLoading={isLoading} isCreating={isCreating} />
    </form>
  );
};
