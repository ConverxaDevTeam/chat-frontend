import { Input } from "@components/forms/input";
import Modal from "@components/Modal";
import { InputGroup } from "@components/forms/inputGroup";
import { useForm, FieldError, FieldErrors } from "react-hook-form";
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

export function AuthenticatorFormModal({
  show,
  onClose,
  onSubmit,
  initialData,
  organizationId,
}: AuthenticatorFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthenticatorType>({
    defaultValues: initialData || {
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
    },
  });

  useEffect(() => {
    if (show) {
      reset(
        initialData || {
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
        }
      );
    }
  }, [show, initialData, organizationId, reset]);

  const handleFormSubmit = async (data: AuthenticatorType) => {
    await onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const getNestedError = (path: NestedKeys): FieldError | undefined => {
    const parts = path.split(".");
    let result: unknown = errors;

    for (const part of parts) {
      result = (result as Record<string, unknown>)?.[part];
      if (!result) return undefined;
    }

    return result as FieldError | undefined;
  };

  return (
    <Modal
      isShown={show}
      onClose={onClose}
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {initialData ? "Editar" : "Agregar"} Autenticador
          </h2>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <InputGroup label="Nombre" errors={errors.name as FieldError}>
          <Input
            placeholder="Nombre del autenticador"
            register={register("name", {
              required: "El nombre es obligatorio",
            })}
            error={errors.name?.message}
          />
        </InputGroup>

        <InputGroup label="URL" errors={getNestedError("config.url")}>
          <Input
            placeholder="URL del endpoint"
            register={register("config.url", {
              required: "La URL es obligatoria",
            })}
            error={getNestedError("config.url")?.message}
          />
        </InputGroup>

        <InputGroup label="Método" errors={getNestedError("config.method")}>
          <select
            {...register("config.method")}
            className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
          >
            {Object.values(HttpMethod).map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </InputGroup>

        <InputGroup
          label="Token Path"
          errors={getNestedError("config.injectConfig.tokenPath")}
        >
          <Input
            placeholder="Ruta del token en la respuesta"
            register={register("config.injectConfig.tokenPath", {
              required: "El token path es obligatorio",
            })}
            error={getNestedError("config.injectConfig.tokenPath")?.message}
          />
        </InputGroup>

        <InputGroup
          label="Refresh Path"
          errors={getNestedError("config.injectConfig.refreshPath")}
        >
          <Input
            placeholder="Ruta del refresh token en la respuesta"
            register={register("config.injectConfig.refreshPath", {
              required: "El refresh path es obligatorio",
            })}
            error={getNestedError("config.injectConfig.refreshPath")?.message}
          />
        </InputGroup>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleCancel}
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
}
