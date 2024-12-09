import { useForm, SubmitHandler } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { useState } from "react";
import { agentService } from "@services/agent";

interface AgentFormValues {
  name: string;
  description: string;
}

interface AgenteFormProps {
  agentId: number;
  initialData?: {
    name: string;
    description: string;
  };
  onSuccess?: () => void;
}

export const AgenteForm = ({
  agentId,
  initialData,
  onSuccess,
}: AgenteFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgentFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit: SubmitHandler<AgentFormValues> = async formData => {
    if (!agentId) throw new Error("Agent ID is required");

    setIsLoading(true);
    try {
      const agentData = {
        name: formData.name,
        config: {
          instruccion: formData.description,
        },
      };
      await agentService.update(agentId, agentData);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <InputGroup label="Nombre" errors={errors.name}>
        <Input
          placeholder="Nombre del agente"
          register={register("name", { required: "El nombre es obligatorio" })}
          error={errors.name?.message}
        />
      </InputGroup>
      <InputGroup label="Descripción" errors={errors.description}>
        <TextArea
          placeholder="Descripción del agente"
          register={register("description", {
            required: "La descripción es obligatoria",
          })}
          error={errors.description?.message}
          rows={4}
        />
      </InputGroup>
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
};
