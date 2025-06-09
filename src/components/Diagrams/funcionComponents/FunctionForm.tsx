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
  BodyType,
} from "@interfaces/functions.interface";
import { Button } from "@components/common/Button";
import InfoTooltip from "@components/common/InfoTooltip";

// Tipos y constantes
interface FunctionFormValues {
  name: string;
  description: string;
  url: string;
  method: HttpMethod;
  bodyType: BodyType;
}

interface FunctionFormProps {
  functionId?: number;
  initialData?: FunctionData<HttpRequestFunction>;
  onSuccess?: (data: FunctionData<HttpRequestFunction>) => void;
  isLoading?: boolean;
  agentId?: number;
  onCancel?: () => void;
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
      bodyType: initialData?.config?.bodyType || BodyType.JSON,
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
        bodyType: formData.bodyType,
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
  label: string;
  placeholder: string;
  validation?: Record<string, unknown>;
  type?: FieldType;
  options?: { value: string; label: string }[];
  rows?: number;
  helpText?: React.ReactNode;
  tooltip?: React.ReactNode;
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
  label,
  placeholder,
  validation = {},
  type = "input",
  options = [],
  rows = 2,
  helpText,
  tooltip,
}: FormFieldProps & { errors: FieldErrors<FunctionFormValues> }) => {
  return (
    <InputGroup label={label} errors={errors[name]} tooltip={tooltip}>
      {helpText}
      <RenderField
        register={register}
        control={control}
        name={name}
        label={label}
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
  onCancel?: () => void;
}

const SubmitButton = ({
  isLoading,
  isCreating,
  onCancel,
}: SubmitButtonProps) => (
  <div className="flex gap-2 -mt-5">
    <Button type="button" variant="cancel" onClick={onCancel}>
      Cancelar
    </Button>
    <Button type="submit" variant="primary" disabled={isLoading}>
      {isLoading
        ? "Guardando..."
        : isCreating
          ? "Crear función"
          : "Actualizar función"}
    </Button>
  </div>
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
      label: "Nombre",
      placeholder: "Nombre de la función",
      validation: { required: "El nombre es obligatorio" },
      type: "input",
      tooltip: (
        <InfoTooltip
          text="Dale un nombre descriptivo a esta función. Ejemplo: ConsultarEstadoPedido o CrearTicketSoporte."
          width="220px"
        />
      ),
      helpText: (
        <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
          Nombre único que identifique la función
        </p>
      ),
    },
    {
      name: "description",
      label: "Descripción",
      placeholder: "Descripción de la función",
      validation: { required: "La descripción es obligatoria" },
      type: "textarea",
      rows: 3,
      tooltip: (
        <InfoTooltip
          text="Describe brevemente el propósito de esta función para que otros usuarios puedan entender su uso. Ejemplo: 'Consulta el estado de un pedido según el número de orden.'"
          width="220px"
        />
      ),
      helpText: (
        <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
          ¿Qué hace esta función?
        </p>
      ),
    },
    {
      name: "url",
      label: "URL",
      placeholder: "URL del endpoint",
      validation: { required: "La URL es obligatoria" },
      type: "input",
      tooltip: (
        <InfoTooltip
          text="Ingresa la URL completa del endpoint de tu API. Asegúrate de que sea accesible públicamente y acepte las solicitudes desde tu agente. Ejemplo: https://api.misitio.com/orden/estado"
          width="220px"
        />
      ),
      helpText: (
        <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
          URL del endpoint que deseas conectar
        </p>
      ),
    },
    {
      name: "method",
      label: "Método",
      placeholder: "",
      validation: { required: "El tipo de operación es obligatorio" },
      type: "select",
      options: HTTP_METHODS,
      helpText: (
        <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
          Selecciona el método HTTP a utilizar (GET: para leer datos, POST: para enviar información.)
        </p>
      ),
      tooltip: (
        <InfoTooltip
          text="Indica cómo el agente debe comunicarse con el endpoint."
          width="220px"
        />
      ),
    },
    {
      name: "bodyType",
      label: "Tipo de Body",
      placeholder: "",
      validation: { required: "El tipo de body es obligatorio" },
      type: "select",
      options: [
        { value: BodyType.JSON, label: "JSON" },
        { value: BodyType.FORM_DATA, label: "Form Data" },
      ],
      tooltip: (
        <InfoTooltip
          text="Selecciona el formato en que se enviará el cuerpo de la solicitud. JSON: estructura de datos estándar. Form: datos codificados como formulario."
          width="220px"
        />
      ),
      helpText: (
        <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
          Formato de los datos enviados al endpoint
        </p>
      ),
    },
  ] as const satisfies Array<{
    name: keyof FunctionFormValues;
    label: string;
    placeholder: string;
    validation: { required: string; pattern?: string };
    type: string;
    rows?: number;
    options?: { value: string; label: string }[];
    helpText?: React.ReactNode;
    tooltip?: React.ReactNode;
  }>;

  return (
    <form onSubmit={onSubmit} className="grid gap-[42px] flex-1">
      <div className="overflow-y-auto grid gap-[18px]">
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
      <SubmitButton
        isLoading={isLoading ?? false}
        isCreating={isCreating}
        onCancel={props.onCancel}
      />
    </form>
  );
};
