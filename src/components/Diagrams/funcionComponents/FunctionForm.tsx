import { useForm, SubmitHandler } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { Select } from "@components/forms/select";
import { useState } from "react";
import {
  HttpMethod,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

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

export const FunctionForm = ({
  functionId,
  initialData,
  onSuccess,
}: FunctionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !functionId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FunctionFormValues>({
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

      // TODO: Implement function service
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="max-h-[75vh] overflow-y-auto">
        <InputGroup label="Nombre de la función" errors={errors.name}>
          <Input
            placeholder="Ej: Obtener clima"
            register={register("name", {
              required: "El nombre es obligatorio",
            })}
            error={errors.name?.message}
          />
        </InputGroup>

        <InputGroup label="Descripción" errors={errors.description}>
          <TextArea
            placeholder="Ej: Esta función obtiene el clima actual de una ciudad"
            register={register("description", {
              required: "La descripción es obligatoria",
            })}
            error={errors.description?.message}
            rows={2}
          />
        </InputGroup>

        <InputGroup label="URL del servicio" errors={errors.url}>
          <Input
            placeholder="https://api.ejemplo.com/endpoint"
            register={register("url", {
              required: "La URL es obligatoria",
              pattern: {
                value: /^https?:\/\/.+/,
                message:
                  "Debe ser una URL válida que comience con http:// o https://",
              },
            })}
            error={errors.url?.message}
          />
        </InputGroup>

        <InputGroup label="Tipo de operación" errors={errors.method}>
          <Select
            options={HTTP_METHODS}
            register={register("method", {
              required: "El tipo de operación es obligatorio",
            })}
            error={errors.method?.message}
          />
        </InputGroup>
      </div>

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
    </form>
  );
};
