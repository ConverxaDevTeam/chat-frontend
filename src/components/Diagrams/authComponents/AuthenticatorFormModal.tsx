import {
  Autenticador,
  AutenticadorType,
  injectPlaces,
  HttpAutenticador,
  BearerConfig,
  ApiKeyAutenticador,
  ApiKeyInjectPlaces,
} from "@interfaces/autenticators.interface";
import { HttpMethod } from "@interfaces/functions.interface";
import { useEffect, useState, useCallback } from "react";
import { EndpointAuthenticatorForm } from "./EndpointAuthenticatorForm";
import { ApiKeyAuthenticatorForm } from "./ApiKeyAuthenticatorForm";
import { useWatch } from "react-hook-form";
import { Input } from "@components/forms/input";
import Modal from "@components/Modal";
import { InputGroup } from "@components/forms/inputGroup";
import {
  useForm,
  UseFormRegister,
  FieldError,
  FieldErrors,
} from "react-hook-form";

// Types
type EndpointAuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;
type ApiKeyAuthenticatorType = ApiKeyAutenticador;
type FormData = EndpointAuthenticatorType | ApiKeyAuthenticatorType;

type NestedKeys =
  | keyof EndpointAuthenticatorType
  | keyof ApiKeyAuthenticatorType
  | "config.url"
  | "config.method"
  | "config.injectConfig.tokenPath"
  | "config.injectConfig.refreshPath";

interface AuthenticatorFormModalProps {
  isShown: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: FormData;
  organizationId: number;
}

type FormFieldType = {
  label: string;
  placeholder: string;
  name: NestedKeys;
  type: "text" | "select" | "number";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};

interface FormFieldProps extends FormFieldType {
  register: UseFormRegister<FormData>;
  error?: FieldError;
}

// Hooks
const useAuthenticatorForm = ({
  initialData,
  organizationId,
  onSubmit,
}: Pick<
  AuthenticatorFormModalProps,
  "initialData" | "organizationId" | "onSubmit"
>) => {
  const form = useForm<FormData>({
    defaultValues: initialData || DEFAULT_VALUES(organizationId),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const getNestedError = (path: NestedKeys): FieldError | undefined => {
    const [first, ...rest] = path.split(".");
    const firstError = errors[first as keyof typeof errors];

    if (!firstError) return undefined;

    if (rest.length === 0) {
      return firstError as FieldError;
    }

    const nestedErrors = firstError as Record<string, FieldError>;
    const nestedPath = rest.join(".");
    return nestedErrors[nestedPath];
  };

  return {
    register,
    getNestedError,
    errors,
    reset,
    control,
    handleSubmit: handleSubmit(onSubmit),
  };
};

// Components
const FormField = ({
  label,
  placeholder,
  name,
  register,
  error,
  type = "text",
  options = [],
  required = true,
}: FormFieldProps) => (
  <InputGroup label={label} errors={error}>
    {type === "select" ? (
      <select
        {...register(name, {
          required: required ? "Este campo es requerido" : false,
        })}
        className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
      >
        <option value="">Seleccionar...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === "number" ? (
      <input
        type="number"
        min="0"
        {...register(name, {
          required: required ? "Este campo es requerido" : false,
        })}
        className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
      />
    ) : (
      <Input
        placeholder={placeholder}
        register={register(name, {
          required: required ? "Este campo es requerido" : false,
        })}
      />
    )}
  </InputGroup>
);

const COMMON_FIELDS: FormFieldType[] = [
  {
    label: "Nombre",
    placeholder: "Nombre del autenticador",
    name: "name",
    type: "text",
  },
  {
    label: "Tipo",
    placeholder: "Tipo de autenticador",
    name: "type",
    type: "select",
    options: [
      { value: AutenticadorType.ENDPOINT, label: "Endpoint" },
      { value: AutenticadorType.API_KEY, label: "API Key" },
    ],
  },
];

const DEFAULT_VALUES = (
  organizationId: number,
  type = AutenticadorType.ENDPOINT
): FormData => {
  const baseValues = {
    name: "",
    organizationId,
    value: "",
    life_time: 0,
    type,
  };

  if (type === AutenticadorType.ENDPOINT) {
    return {
      ...baseValues,
      config: {
        url: "",
        method: HttpMethod.POST,
        params: {
          username: "",
          password: "",
        },
        injectPlace: injectPlaces.BEARER_HEADER,
        injectConfig: {
          tokenPath: "",
          refreshPath: "",
        },
      },
    } as EndpointAuthenticatorType;
  }

  return {
    ...baseValues,
    config: {
      injectPlace: ApiKeyInjectPlaces.HEADER,
      key: "",
    },
  } as ApiKeyAuthenticatorType;
};

const AuthenticatorFormModal = ({
  isShown,
  onClose,
  onSubmit,
  initialData,
  organizationId,
}: AuthenticatorFormModalProps) => {
  const { register, reset, control, handleSubmit, errors, getNestedError } =
    useAuthenticatorForm({
      initialData,
      organizationId,
      onSubmit,
    });

  const [params, setParams] = useState<Array<{ key: string; value: string }>>(
    []
  );

  const onUpdateParam = useCallback(
    (index: number, field: "key" | "value", value: string) => {
      setParams(prev =>
        prev.map((param, i) =>
          i === index ? { ...param, [field]: value } : param
        )
      );
    },
    []
  );

  const authenticatorType = useWatch({
    control,
    name: "type",
  });

  useEffect(() => {
    if (!initialData) {
      reset(DEFAULT_VALUES(organizationId, authenticatorType));
    }
  }, [authenticatorType, organizationId, initialData, reset]);

  const handleClose = () => {
    reset(DEFAULT_VALUES(organizationId));
    onClose();
  };

  return (
    <Modal
      isShown={isShown}
      onClose={handleClose}
      header={
        <h2 className="text-lg font-medium">
          {initialData ? "Editar Autenticador" : "Crear Autenticador"}
        </h2>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {COMMON_FIELDS.map(field => (
          <FormField
            key={field.name}
            {...field}
            register={register}
            error={getNestedError(field.name)}
          />
        ))}

        {authenticatorType === AutenticadorType.ENDPOINT ? (
          <EndpointAuthenticatorForm
            register={register as UseFormRegister<EndpointAuthenticatorType>}
            errors={errors as FieldErrors<EndpointAuthenticatorType>}
            onUpdateParam={onUpdateParam}
            params={params}
          />
        ) : (
          <ApiKeyAuthenticatorForm
            register={register as UseFormRegister<ApiKeyAuthenticatorType>}
            errors={errors as FieldErrors<ApiKeyAuthenticatorType>}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthenticatorFormModal;
