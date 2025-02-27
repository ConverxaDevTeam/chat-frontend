import { useForm, SubmitHandler } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { useState } from "react";
import { agentService } from "@services/agent";
import GuideConfig from "@components/GuideConfig";

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
  onClose: () => void;
  onSuccess?: () => void;
}

export const AgenteForm = ({
  agentId,
  initialData,
  onClose,
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-[24px] w-[587px]"
    >
      <GuideConfig />
      <div className="flex-1 flex flex-col gap-[16px]">
        <InputGroup label="Escribe el nombre del agente" errors={errors.name}>
          <Input
            placeholder="Nombre del agente"
            register={register("name", {
              required: "El nombre es obligatorio",
            })}
            error={errors.name?.message}
          />
        </InputGroup>
        <InputGroup label="Instrucción" errors={errors.description}>
          <TextArea
            placeholder="Descripción del agente"
            register={register("description", {
              required: "La descripción es obligatoria",
            })}
            error={errors.description?.message}
            rows={8}
          />
        </InputGroup>
        <div className="flex gap-[16px] justify-end">
          <button
            type="button"
            className="w-[64px] h-[24px] text-sofia-superDark font-medium text-[12px] bg-sofia-electricGreen rounded-[4px]"
          >
            Ejemplo 1
          </button>
          <button
            type="button"
            className="w-[64px] h-[24px] text-sofia-superDark font-medium text-[12px] bg-sofia-electricGreen rounded-[4px]"
          >
            Ejemplo 2
          </button>
          <button
            type="button"
            className="w-[64px] h-[24px] text-sofia-superDark font-medium text-[12px] bg-sofia-electricGreen rounded-[4px]"
          >
            Ejemplo 3
          </button>
        </div>
        <div className="flex gap-[16px] mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[48px] text-sofia-navyBlue border-sofia-navyBlue border-[1px] font-semibold rounded-[8px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-[259px] h-[48px] text-sofia-superDark font-semibold bg-sofia-electricGreen rounded-[8px] hover:bg-opacity-70 disabled:bg-opacity-75"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
};
