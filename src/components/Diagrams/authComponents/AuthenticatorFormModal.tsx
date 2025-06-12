import {
  AutenticadorType,
  injectPlaces,
  ApiKeyInjectPlaces,
  ApiKeyAuthenticatorType,
  EndpointAuthenticatorType,
  AuthenticatorType,
} from "@interfaces/autenticators.interface";
import { HttpMethod } from "@interfaces/functions.interface";
import { useEffect, useState, useCallback } from "react";
import { EndpointAuthenticatorForm } from "./EndpointAuthenticatorForm";
import { ApiKeyAuthenticatorForm } from "./ApiKeyAuthenticatorForm";
import { Control, useWatch } from "react-hook-form";
import { Input } from "@components/forms/input";
import Modal from "@components/Modal";
import { InputGroup } from "@components/forms/inputGroup";
import {
  useForm,
  UseFormRegister,
  FieldError,
  FieldErrors,
} from "react-hook-form";
import {
  useCreateAuthenticator,
  useUpdateAuthenticator,
} from "../hooks/useAuthenticatorActions";

type NestedKeys =
  | keyof EndpointAuthenticatorType
  | keyof ApiKeyAuthenticatorType
  | "config.url"
  | "config.method"
  | "config.injectConfig.tokenPath"
  | "config.injectConfig.refreshPath"
  | "config.params"
  | "config.injectPlace"
  | "config.key"
  | "field_name";

interface AuthenticatorFormModalProps {
  isShown: boolean;
  onClose: () => void;
  onSubmit: (
    data: AuthenticatorType,
    result: AuthenticatorType
  ) => Promise<void>;
  initialData?: AuthenticatorType;
  organizationId: number;
  zindex?: number;
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
  register: UseFormRegister<AuthenticatorType>;
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
  const createAuthenticator = useCreateAuthenticator();
  const updateAuthenticator = useUpdateAuthenticator();

  const form = useForm<AuthenticatorType>({
    defaultValues: initialData || DEFAULT_VALUES(organizationId),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
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

  const handleFormSubmit = async (data: AuthenticatorType) => {
    const result = data.id
      ? await updateAuthenticator(data.id, data)
      : await createAuthenticator(data);

    if (result.success && result.data) {
      await onSubmit(data, result.data);
    }
  };

  return {
    register,
    getNestedError,
    errors,
    reset,
    control,
    handleSubmit: handleSubmit(handleFormSubmit),
    setValue,
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
    label: "Nombre del Campo",
    placeholder: "Nombre del campo de autorización",
    name: "field_name",
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
): AuthenticatorType => {
  const baseValues = {
    name: "",
    organizationId,
    value: "",
    life_time: 0,
    field_name: "Authorization",
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
          field_name: "Authorization",
        },
      },
    } as EndpointAuthenticatorType;
  }

  return {
    ...baseValues,
    config: {
      injectPlace: ApiKeyInjectPlaces.HEADER,
      key: "",
      field_name: "Authorization",
    },
  } as ApiKeyAuthenticatorType;
};

const AuthenticatorFormModal = ({
  isShown,
  onClose,
  onSubmit,
  initialData,
  organizationId,
  zindex,
}: AuthenticatorFormModalProps) => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    errors,
    getNestedError,
    setValue,
  } = useAuthenticatorForm({
    initialData,
    organizationId,
    onSubmit,
  });

  // Inicializar los parámetros con valores por defecto o desde datos iniciales
  const initialParams = [
    { key: "username", value: "" },
    { key: "password", value: "" },
  ];

  const [params, setParams] = useState<Array<{ key: string; value: string }>>(
    initialData && initialData.type === AutenticadorType.ENDPOINT
      ? Object.entries(
          (initialData as EndpointAuthenticatorType).config.params || {}
        ).map(([key, value]) => ({ key, value: String(value) }))
      : initialParams
  );

  const authenticatorType = useWatch({
    control,
    name: "type",
  });

  // Inicialización con datos iniciales
  useEffect(() => {
    if (!initialData) return;
    reset(initialData);

    if (initialData.type !== AutenticadorType.ENDPOINT) return;
    const endpointData = initialData as EndpointAuthenticatorType;
    if (endpointData.config.params) {
      const paramEntries = Object.entries(endpointData.config.params);
      if (paramEntries.length > 0) {
        setParams(
          paramEntries.map(([key, value]) => ({
            key,
            value: String(value),
          }))
        );
        // Asegurarse de que los parámetros estén correctamente configurados en el formulario
        setValue("config.params", endpointData.config.params);
      } else {
        setParams(initialParams);
        // Configurar los parámetros por defecto en el formulario
        const paramsObject = initialParams.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        );
        setValue("config.params", paramsObject);
      }
    } else {
      setParams(initialParams);
      // Configurar los parámetros por defecto en el formulario
      const paramsObject = initialParams.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      );
      setValue("config.params", paramsObject);
    }
  }, [initialData, reset, setValue]);

  // Manejo de cambio de tipo
  useEffect(() => {
    if (!initialData) {
      const values = DEFAULT_VALUES(organizationId, authenticatorType);
      if (!values.field_name) {
        values.field_name = "Authorization";
      }
      reset(values);

      // Reiniciar parámetros cuando cambia el tipo
      if (authenticatorType === AutenticadorType.ENDPOINT) {
        // Asegurarse de que los parámetros iniciales estén configurados
        const newParams = initialParams.slice();
        setParams(newParams);

        // Actualizar los parámetros en el formulario
        const paramsObject = newParams.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        );
        setValue("config.params", paramsObject);
      } else {
        setParams([]);
      }
    }
  }, [authenticatorType, organizationId, reset, initialData, setValue]);

  const onUpdateParam = useCallback(
    (index: number, field: "key" | "value", value: string) => {
      setParams(prev => {
        const newParams = prev.map((param, i) =>
          i === index ? { ...param, [field]: value } : param
        );

        if (control._formValues.type === AutenticadorType.ENDPOINT) {
          const paramsObject = newParams.reduce(
            (acc, { key, value }) => ({ ...acc, [key]: value }),
            {}
          );
          setValue("config.params", paramsObject);
        }

        return newParams;
      });
    },
    [control, setValue]
  );

  const handleClose = () => {
    reset(DEFAULT_VALUES(organizationId));
    onClose();
  };

  return (
    <Modal
      isShown={isShown}
      onClose={handleClose}
      zindex={zindex}
      header={
        <div className="w-[518px]">
          <h2 className="text-lg font-semibold">
            {initialData ? "Editar Autenticador" : "Crear Autenticador"}
          </h2>
        </div>
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
            control={control as Control<EndpointAuthenticatorType>}
            errors={errors as FieldErrors<EndpointAuthenticatorType>}
            onUpdateParam={onUpdateParam}
            params={params}
          />
        ) : (
          <ApiKeyAuthenticatorForm
            register={register as UseFormRegister<ApiKeyAuthenticatorType>}
            control={control as Control<ApiKeyAuthenticatorType>}
            errors={errors as FieldErrors<ApiKeyAuthenticatorType>}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="w-full px-4 py-3 bg-sofia-superDark text-white rounded text-sm font-normal hover:bg-opacity-50 transition-all"
          >
            {initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthenticatorFormModal;
