import { useForm, SubmitHandler } from "react-hook-form";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import { useState } from "react";
import { agentService } from "@services/agent";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import InfoTooltip from "@components/common/InfoTooltip";
import { Button } from "@components/common/Button";

const EXAMPLES_INSTRUCTIONS = {
  example1:
    "Eres un asistente virtual especializado en atención al cliente. Tu objetivo es ayudar a los usuarios a resolver sus dudas sobre nuestros productos y servicios de manera amable y eficiente. Debes ser capaz de proporcionar información precisa y ofrecer soluciones prácticas a los problemas comunes.",
  example2:
    "Eres un asistente de ventas especializado en nuestros productos tecnológicos. Tu función es guiar a los clientes en el proceso de compra, recomendando productos según sus necesidades, explicando características técnicas en términos sencillos y ayudando a comparar diferentes opciones.",
  example3:
    "Eres un asistente de soporte técnico. Tu misión es ayudar a los usuarios a resolver problemas técnicos con nuestros productos. Debes ser capaz de diagnosticar problemas comunes, proporcionar instrucciones paso a paso para solucionarlos y escalar casos complejos cuando sea necesario.",
};

const EXAMPLES_SUMMARIES = {
  example1:
    "Asistente de atención al cliente: Resuelve dudas y proporciona soluciones amables y eficientes.",
  example2:
    "Asistente de ventas: Guía en el proceso de compra y explica características técnicas de forma sencilla.",
  example3:
    "Asistente de soporte técnico: Diagnostica problemas y proporciona soluciones paso a paso.",
};

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
  const { handleOperation } = useAlertContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AgentFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const examples = (example: keyof typeof EXAMPLES_INSTRUCTIONS) => {
    setValue("description", EXAMPLES_INSTRUCTIONS[example], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit: SubmitHandler<AgentFormValues> = async formData => {
    if (!agentId) throw new Error("Agent ID is required");

    setIsLoading(true);

    try {
      await handleOperation(
        async () => {
          const agentData = {
            name: formData.name,
            config: {
              instruccion: formData.description,
            },
          };
          await agentService.update(agentId, agentData);
        },
        {
          title: "Actualizar agente",
          loadingTitle: "Actualizando agente",
          successTitle: "Éxito",
          successText: "El agente ha sido actualizado correctamente",
          errorTitle: "Error",
        }
      );

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
      className="flex gap-[24px] w-[487px]"
    >
      <div className="flex-1 flex flex-col gap-[16px] p-[8px]">
        <InputGroup
          label="Escribe el nombre del agente"
          errors={errors.name}
          tooltip={
            <InfoTooltip text="Escribe un nombre descriptivo para identificar a tu agente" />
          }
        >
          <Input
            placeholder="Nombre del agente"
            register={register("name", {
              required: "El nombre es obligatorio",
            })}
            error={errors.name?.message}
          />
        </InputGroup>
        <InputGroup label="Instrucción" errors={errors.description}>
          <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
            ¿Tienes duda de cómo comenzar? Visita nuestro{" "}
            <a target="_blank" rel="noopener noreferrer" className="underline">
              knowledge base
            </a>
          </p>
          <TextArea
            placeholder="Descripción del agente"
            register={register("description", {
              required: "La descripción es obligatoria",
            })}
            error={errors.description?.message}
            rows={8}
          />
          <div className="flex gap-[16px] justify-start">
            <div className="group relative">
              <button
                type="button"
                className="w-[84px] h-[24px] px-[12px] text-sofia-superDark font-medium text-[12px] border-sofia-superDark border-[1px] rounded-[4px] hover:bg-gray-100 transition-colors"
                onClick={() => examples("example1")}
              >
                Ejemplo 1
              </button>
              <div className="absolute z-10 left-0 bottom-full mb-2 hidden group-hover:block bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded whitespace-normal w-[180px]">
                {EXAMPLES_SUMMARIES.example1}
              </div>
            </div>
            <div className="group relative">
              <button
                type="button"
                className="w-[84px] h-[24px] px-[12px] text-sofia-superDark font-medium text-[12px] border-sofia-superDark border-[1px] rounded-[4px] hover:bg-gray-100 transition-colors"
                onClick={() => examples("example2")}
              >
                Ejemplo 2
              </button>
              <div className="absolute z-10 left-0 bottom-full mb-2 hidden group-hover:block bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded whitespace-normal w-[180px]">
                {EXAMPLES_SUMMARIES.example2}
              </div>
            </div>
            <div className="group relative">
              <button
                type="button"
                className="w-[84px] h-[24px] px-[12px] text-sofia-superDark font-medium text-[12px] border-sofia-superDark border-[1px] rounded-[4px] hover:bg-gray-100 transition-colors"
                onClick={() => examples("example3")}
              >
                Ejemplo 3
              </button>
              <div className="absolute z-10 left-0 bottom-full mb-2 hidden group-hover:block bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded whitespace-normal w-[180px]">
                {EXAMPLES_SUMMARIES.example3}
              </div>
            </div>
          </div>
        </InputGroup>
        <div className="flex gap-[16px] mt-[9px]">
          <Button type="button" variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};
