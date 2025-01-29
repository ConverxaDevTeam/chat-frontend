import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  Control,
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
  agentId?: number;
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
    const functionData: FunctionData<HttpRequestFunction> = {
      functionId,
      name: formData.name,
      agentId: props.agentId || -1,
      description: formData.description,
      type: FunctionNodeTypes.API_ENDPOINT,
      config: {
        url: formData.url,
        method: formData.method,
      },
    };
    onSuccess?.(functionData);
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

// Componentes de formulario
interface FormFieldProps {
  register: UseFormRegister<FunctionFormValues>;
  control: Control<FunctionFormValues>;
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
  control,
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
          rows={rows}
        />
      );
    case "select":
      return <Select options={options} control={control} name={name} />;
    default:
      return (
        <Input
          placeholder={placeholder}
          register={register(name, validation)}
        />
      );
  }
};

const FormField = ({
  register,
  control,
  errors,
  name,
  placeholder,
  validation = {},
  type = "input",
  options = [],
  rows = 2,
}: FormFieldProps & { errors: FieldErrors<FunctionFormValues> }) => {
  return (
    <InputGroup label={name} errors={errors[name]}>
      <RenderField
        register={register}
        control={control}
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
      control,
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
      validation: { required: "La URL es obligatoria" },
      type: "input",
    },
    {
      name: "method",
      placeholder: "",
      validation: { required: "El tipo de operación es obligatorio" },
      type: "select",
      options: HTTP_METHODS,
    },
  ] as const satisfies Array<{
    name: keyof FunctionFormValues;
    placeholder: string;
    validation: { required: string; pattern?: string };
    type: string;
    rows?: number;
    options?: { value: string; label: string }[];
  }>;

  return (
    <form onSubmit={onSubmit} className="grid gap-[42px]">
      <div className="max-h-[75vh] w-[470px] overflow-y-auto grid gap-[24px]">
        {formFields.map(field => (
          <FormField
            key={field.name}
            register={register}
            control={control}
            errors={errors}
            {...field}
          />
        ))}
      </div>

      <SubmitButton isLoading={isLoading ?? false} isCreating={isCreating} />
    </form>
  );
};
