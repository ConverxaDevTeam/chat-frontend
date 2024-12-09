import { Input } from "@components/forms/input";
import Modal from "@components/Modal";
import { InputGroup } from "@components/forms/inputGroup";
import {
  useForm,
  UseFormRegister,
  UseFormSetValue,
  FieldError,
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

// Types
type AuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

type NestedKeys =
  | keyof AuthenticatorType
  | "config.url"
  | "config.method"
  | "config.injectConfig.tokenPath"
  | "config.injectConfig.refreshPath";

interface AuthenticatorFormModalProps {
  isShown: boolean;
  onClose: () => void;
  onSubmit: (data: AuthenticatorType) => Promise<void>;
  initialData?: AuthenticatorType;
  organizationId: number;
}

interface DynamicParam {
  key: string;
  value: string;
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
  const form = useForm<AuthenticatorType>({
    defaultValues: DEFAULT_VALUES(organizationId),
  });

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

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
    errors,
    reset,
    setValue,
    getNestedError,
    handleSubmit: handleSubmit(onSubmit),
  };
};

const useDynamicParams = (
  setValue: UseFormSetValue<AuthenticatorType>,
  initialData?: AuthenticatorType
) => {
  const [params, setParams] = useState<DynamicParam[]>([
    { key: "username", value: "" },
    { key: "password", value: "" },
  ]);

  useEffect(() => {
    if (initialData?.config?.params) {
      const entries = Object.entries(initialData.config.params);
      setParams(
        entries.length > 0
          ? entries.map(([key, value]) => ({ key, value }))
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
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
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

  const resetParams = () => {
    setParams([
      { key: "username", value: "" },
      { key: "password", value: "" },
    ]);
  };

  return {
    params,
    updateParam,
    resetParams,
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

const DynamicParamsSection = ({
  params,
  onUpdateParam,
}: {
  params: DynamicParam[];
  onUpdateParam: (index: number, field: "key" | "value", value: string) => void;
}) => (
  <div className="space-y-4 mt-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Parámetros</h3>
    </div>
    {params.map((param, index) => (
      <div key={index} className="flex gap-2 items-start">
        <InputGroup label="Parámetro">
          <Input
            placeholder="Nombre del parámetro"
            value={param.key}
            onChange={e => onUpdateParam(index, "key", e.target.value)}
          />
        </InputGroup>
        <InputGroup label="Valor">
          <Input
            placeholder="Valor"
            value={param.value}
            onChange={e => onUpdateParam(index, "value", e.target.value)}
          />
        </InputGroup>
      </div>
    ))}
  </div>
);

const FormActions = ({
  onClose,
  isEditing,
}: {
  onClose: () => void;
  isEditing: boolean;
}) => (
  <div className="flex justify-end space-x-2 pt-4">
    <button
      type="button"
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      onClick={onClose}
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

// Constants
const DEFAULT_VALUES = (organizationId: number): AuthenticatorType => ({
  name: "",
  organizationId,
  value: "",
  life_time: 0,
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

const FORM_FIELDS: FormFieldType[] = [
  {
    label: "Nombre",
    placeholder: "Nombre del autenticador",
    name: "name",
    type: "text",
  },
  {
    label: "Tiempo de vida (segundos)",
    placeholder: "Tiempo de vida",
    name: "life_time",
    type: "number",
  },
  {
    label: "URL",
    placeholder: "URL del endpoint",
    name: "config.url",
    type: "text",
  },
  {
    label: "Método",
    placeholder: "Método HTTP",
    name: "config.method",
    type: "select",
    options: Object.values(HttpMethod).map(method => ({
      value: method,
      label: method,
    })),
  },
  {
    label: "Token Path",
    placeholder: "Ruta del token en la respuesta",
    name: "config.injectConfig.tokenPath",
    type: "text",
  },
  {
    label: "Refresh Path",
    placeholder: "Ruta del refresh token en la respuesta",
    name: "config.injectConfig.refreshPath",
    type: "text",
  },
];

// Main Component
const AuthenticatorFormModal = ({
  isShown,
  onClose,
  onSubmit,
  initialData,
  organizationId,
}: AuthenticatorFormModalProps) => {
  const { register, reset, setValue, handleSubmit, getNestedError } =
    useAuthenticatorForm({
      initialData,
      organizationId,
      onSubmit,
    });

  const { params, updateParam, resetParams } = useDynamicParams(
    setValue,
    initialData
  );

  const handleClose = () => {
    reset(DEFAULT_VALUES(organizationId));
    resetParams();
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
        {FORM_FIELDS.map(field => (
          <FormField
            key={field.name}
            {...field}
            register={register}
            error={getNestedError(field.name)}
          />
        ))}
        {getNestedError("life_time") && (
          <p className="mt-1 text-sm text-red-500">0 significa que no expira</p>
        )}
        <DynamicParamsSection params={params} onUpdateParam={updateParam} />

        <FormActions onClose={handleClose} isEditing={!!initialData} />
      </form>
    </Modal>
  );
};

export default AuthenticatorFormModal;
