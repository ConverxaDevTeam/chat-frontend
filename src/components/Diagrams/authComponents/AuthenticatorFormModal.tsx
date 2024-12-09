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
import { useEffect, useState } from "react";

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
    setValue,
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
    setValue,
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

interface DynamicParam {
  key: string;
  value: string;
}

const AuthenticatorFormModal = ({
  show,
  onClose,
  onSubmit,
  initialData,
  organizationId,
}: AuthenticatorFormModalProps) => {
  const { register, handleSubmit, getNestedError, setValue, reset } =
    useAuthenticatorForm({
      initialData,
      organizationId,
      show,
      onSubmit,
    });

  const [dynamicParams, setDynamicParams] = useState<DynamicParam[]>([
    { key: "username", value: "" },
    { key: "password", value: "" },
  ]);

  useEffect(() => {
    if (initialData?.config?.params) {
      const entries = Object.entries(initialData.config.params);
      setDynamicParams(
        entries.length > 0
          ? [
              { key: entries[0][0], value: entries[0][1] },
              entries[1]
                ? { key: entries[1][0], value: entries[1][1] }
                : { key: "password", value: "" },
            ]
          : [
              { key: "username", value: "" },
              { key: "password", value: "" },
            ]
      );
    }
  }, [initialData]);

  const updateParam = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newParams = [...dynamicParams];
    newParams[index][field] = value;
    setDynamicParams(newParams);
    updateFormParams(newParams);
  };

  const updateFormParams = (params: DynamicParam[]) => {
    const paramsObject = params.reduce(
      (acc, param) => {
        if (param.key) {
          acc[param.key] = param.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    setValue("config.params", paramsObject);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateFormParams(dynamicParams);
    handleSubmit(async (data: AuthenticatorType) => {
      await onSubmit(data);
    })(e);
  };

  const handleClose = () => {
    reset(DEFAULT_VALUES(organizationId));
    setDynamicParams([
      { key: "username", value: "" },
      { key: "password", value: "" },
    ]);
    onClose();
  };

  return (
    <Modal isShown={show} onClose={handleClose}>
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

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Parámetros</h3>
          </div>

          {dynamicParams.map((param, index) => (
            <div key={index} className="flex gap-2 items-start">
              <InputGroup label="Parámetro">
                <Input
                  placeholder="Nombre del parámetro"
                  value={param.key}
                  onChange={e => updateParam(index, "key", e.target.value)}
                />
              </InputGroup>
              <InputGroup label="Valor">
                <Input
                  placeholder="Valor"
                  value={param.value}
                  onChange={e => updateParam(index, "value", e.target.value)}
                />
              </InputGroup>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthenticatorFormModal;
