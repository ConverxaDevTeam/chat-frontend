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
  initialData?: {
    name: string;
    description: string;
    config: HttpRequestFunction["config"];
  };
  onSuccess?: () => void;
}

const HTTP_METHODS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

// Hook personalizado para manejar el formulario
const useFunctionForm = (props: FunctionFormProps) => {
  const { functionId, initialData, onSuccess } = props;
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
    setIsLoading(true);
    try {
      const functionData = {
        name: formData.name,
        type: "httpRequest",
        config: {
          url: formData.url,
          method: formData.method,
        },
      };

      if (isCreating) {
        console.log("Creating new function:", functionData);
      } else {
        console.log("Updating function:", functionData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving function:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
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
  const { form, isLoading, isCreating, onSubmit } = useFunctionForm(props);
  const {
    register,
    formState: { errors },
  } = form;

  const formFields: FormFieldConfig[] = [
    {
      name: "name",
      placeholder: "Ej: Obtener clima",
      validation: { required: "El nombre es obligatorio" },
      type: "input",
    },
    {
      name: "description",
      placeholder: "Ej: Esta función obtiene el clima actual de una ciudad",
      validation: { required: "La descripción es obligatoria" },
      type: "textarea",
      rows: 2,
    },
    {
      name: "url",
      placeholder: "https://api.ejemplo.com/endpoint",
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
