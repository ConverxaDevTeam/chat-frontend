import { useForm, SubmitHandler } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { Select } from "@components/forms/select";
import { useState } from "react";

interface FunctionFormValues {
  name: string;
  description: string;
  url: string;
  method: string;
  requestBody: string;
}

interface FunctionFormProps {
  functionId?: number;
  initialData?: {
    name: string;
    description: string;
    config: {
      url?: string;
      method?: string;
      requestBody?: Record<string, unknown>;
    };
  };
  onSuccess?: () => void;
}

const HTTP_METHODS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
  { value: "PATCH", label: "PATCH" },
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
      method: initialData?.config?.method || "GET",
      requestBody: initialData?.config?.requestBody
        ? JSON.stringify(initialData.config.requestBody, null, 2)
        : "{}",
    },
  });

  const onSubmit: SubmitHandler<FunctionFormValues> = async formData => {
    setIsLoading(true);
    try {
      const functionData = {
        name: formData.name,
        type: "API_REQUEST",
        config: {
          url: formData.url,
          method: formData.method,
          requestBody: JSON.parse(formData.requestBody),
        },
      };

      // TODO: Implement function service
      if (isCreating) {
        // await functionService.createFunction(functionData);
        console.log("Creating new function:", functionData);
      } else {
        // await functionService.updateFunction(functionId, functionData);
        console.log("Updating function:", functionData);
      }
      onSuccess?.();
    } catch (error) {
      console.error(
        `Error ${isCreating ? "creating" : "updating"} function:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <InputGroup label="Nombre" errors={errors.name}>
        <Input
          placeholder="Nombre de la función"
          register={register("name", { required: "El nombre es obligatorio" })}
          error={errors.name?.message}
        />
      </InputGroup>

      <InputGroup label="Descripción" errors={errors.description}>
        <TextArea
          placeholder="Descripción de la función"
          register={register("description", {
            required: "La descripción es obligatoria",
          })}
          error={errors.description?.message}
          rows={2}
        />
      </InputGroup>

      <InputGroup label="URL" errors={errors.url}>
        <Input
          placeholder="https://api.ejemplo.com/endpoint"
          register={register("url", {
            required: "La URL es obligatoria",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Debe ser una URL válida",
            },
          })}
          error={errors.url?.message}
        />
      </InputGroup>

      <InputGroup label="Método HTTP" errors={errors.method}>
        <Select
          options={HTTP_METHODS}
          register={register("method", {
            required: "El método es obligatorio",
          })}
          error={errors.method?.message}
        />
      </InputGroup>

      <InputGroup
        label="Cuerpo de la Petición (JSON)"
        errors={errors.requestBody}
      >
        <TextArea
          placeholder="{}"
          register={register("requestBody", {
            required: "El cuerpo de la petición es obligatorio",
            validate: value => {
              try {
                JSON.parse(value);
                return true;
              } catch (e) {
                return "El JSON no es válido";
              }
            },
          })}
          error={errors.requestBody?.message}
          rows={4}
        />
      </InputGroup>

      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : isCreating ? "Crear" : "Guardar"}
      </button>
    </form>
  );
};
