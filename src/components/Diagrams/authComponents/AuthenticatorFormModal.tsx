import { Input } from "@components/forms/input";
import Modal from "@components/Modal";
import { InputGroup } from "@components/forms/inputGroup";
import {
  useForm,
  FieldError,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import {
  Autenticador,
  AutenticadorType,
  injectPlaces,
  HttpAutenticador,
  BearerConfig,
} from "@interfaces/autenticators.interface";
import { HttpMethod } from "@interfaces/functions.interface";
import { useEffect } from "react";

type AuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

interface AuthenticatorFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: AuthenticatorType) => Promise<void>;
  initialData?: AuthenticatorType;
  organizationId: number;
}

type NestedFieldErrors = FieldErrors<AuthenticatorType>;
type NestedKeys =
  | keyof NestedFieldErrors
  | "config.url"
  | "config.method"
  | "config.injectConfig.tokenPath"
  | "config.injectConfig.refreshPath";

const DEFAULT_VALUES = (organizationId: number): AuthenticatorType => ({
  name: "",
  organizationId,
  value: "",
  life_time: 3600,
  type: AutenticadorType.ENDPOINT,
  config: {
    url: "",
    method: HttpMethod.POST,
    params: {},
    injectPlace: injectPlaces.BEARER_HEADER,
    injectConfig: {
      tokenPath: "",
      refreshPath: "",
    },
  },
});

const useAuthenticatorForm = ({
  initialData,
  organizationId,
}: Pick<
  AuthenticatorFormModalProps,
  "initialData" | "organizationId" | "show" | "onSubmit"
>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthenticatorType>({
    defaultValues: DEFAULT_VALUES(organizationId),
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const getNestedError = (path: NestedKeys) => {
    return (errors as Record<string, unknown>)[path] as FieldError | undefined;
  };

  return {
    register,
    handleSubmit,
    errors,
    getNestedError,
    reset,
  };
};

interface FormFieldConfig {
  label: string;
  placeholder: string;
  name: NestedKeys;
  required?: boolean;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
  validation?: Record<string, unknown>;
}

interface FormFieldProps extends Omit<FormFieldConfig, "name"> {
  name: NestedKeys;
  error?: FieldError;
  register: (
    name: string,
    validation?: Record<string, unknown>
  ) => ReturnType<UseFormRegister<AuthenticatorType>>;
}

const FormField = ({
  label,
  placeholder,
  name,
  register,
  error,
  required = true,
  type = "text",
  options = [],
  validation = {},
}: FormFieldProps) => (
  <InputGroup label={label} errors={error}>
    {type === "select" ? (
      <select
        {...register(name, {
          required: required ? "Este campo es requerido" : false,
          ...validation,
        })}
        className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <Input
        type={type}
        placeholder={placeholder}
        register={register(name, {
          required: required ? "Este campo es requerido" : false,
          ...validation,
        })}
      />
    )}
  </InputGroup>
);

const FORM_FIELDS: FormFieldConfig[] = [
  {
    label: "Nombre",
    placeholder: "Nombre del autenticador",
    name: "name" as NestedKeys,
    required: true,
    type: "text",
  },
  {
    label: "URL",
    placeholder: "URL del endpoint",
    name: "config.url" as NestedKeys,
    required: true,
    type: "text",
  },
  {
    label: "Método",
    placeholder: "Método HTTP",
    name: "config.method" as NestedKeys,
    required: true,
    type: "select",
    options: Object.values(HttpMethod).map(method => ({
      value: method,
      label: method,
    })),
  },
  {
    label: "Token Path",
    placeholder: "Ruta del token en la respuesta",
    name: "config.injectConfig.tokenPath" as NestedKeys,
    required: true,
    type: "text",
  },
  {
    label: "Refresh Path",
    placeholder: "Ruta del refresh token en la respuesta",
    name: "config.injectConfig.refreshPath" as NestedKeys,
    required: true,
    type: "text",
  },
];

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const FormActions = ({ onCancel, isEditing }: FormActionsProps) => (
  <div className="flex justify-end space-x-2 pt-4">
    <button
      type="button"
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      onClick={onCancel}
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      {isEditing ? "Actualizar" : "Crear"}
    </button>
  </div>
);

export function AuthenticatorFormModal({
  show,
  onClose,
  onSubmit,
  initialData,
  organizationId,
}: AuthenticatorFormModalProps) {
  const { register, handleSubmit, getNestedError } = useAuthenticatorForm({
    initialData,
    organizationId,
    show,
    onSubmit,
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(async (data: AuthenticatorType) => {
      await onSubmit(data);
    })(e);
  };

  return (
    <Modal isShown={show} onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
        {FORM_FIELDS.map(field => (
          <FormField
            key={field.name}
            {...field}
            error={getNestedError(field.name)}
            register={(name, validation) =>
              register(name as keyof AuthenticatorType, { ...validation })
            }
          />
        ))}
        <FormActions onCancel={onClose} isEditing={!!initialData} />
      </form>
    </Modal>
  );
}
