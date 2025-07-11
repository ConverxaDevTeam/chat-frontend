import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StepComponentProps } from "../types";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { TextArea } from "@components/forms/textArea";
import InfoTooltip from "@components/common/InfoTooltip";
import { agentService } from "@services/agent";
import { Agent } from "@interfaces/agents";
import StepContainer from "../components/StepContainer";

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

const EXAMPLES_TITLES = {
  example1: "Atención al cliente",
  example2: "Ventas",
  example3: "Soporte técnico",
};

interface AgentFormValues {
  name: string;
  instruction: string;
}

const AgentStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  agentId,
}) => {
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AgentFormValues>({
    defaultValues: {
      name: data.agent.name || "",
      instruction: data.agent.instruction || "",
    },
  });

  // Watch form values to update parent data
  const watchedName = watch("name");
  const watchedInstruction = watch("instruction");

  useEffect(() => {
    // Only update if values actually changed and are not empty
    if (
      watchedName !== data.agent.name ||
      watchedInstruction !== data.agent.instruction
    ) {
      updateData("agent", {
        name: watchedName || "",
        instruction: watchedInstruction || "",
      });
    }
  }, [
    watchedName,
    watchedInstruction,
    data.agent.name,
    data.agent.instruction,
    updateData,
  ]);

  // Load agent data when agentId is available
  useEffect(() => {
    if (agentId) {
      loadAgentData();
    }
  }, [agentId]);

  const loadAgentData = async () => {
    if (!agentId) return;

    setIsLoading(true);
    try {
      const agent = await agentService.getById(agentId);
      setAgentData(agent);

      // Update form values with loaded data
      setValue("name", agent.name);
      setValue("instruction", agent.config.instruccion);

      // Update parent data
      updateData("agent", {
        id: agent.id,
        name: agent.name,
        instruction: agent.config.instruccion,
      });
    } catch (error) {
      console.error("Error loading agent data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setExample = (example: keyof typeof EXAMPLES_INSTRUCTIONS) => {
    setValue("instruction", EXAMPLES_INSTRUCTIONS[example], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <StepContainer
      title="Configura tu agente"
      subtitle="Personaliza el asistente con IA que hablará en nombre de tu empresa."
    >
      <div className="space-y-6">
        {/* Agent Name */}
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

        {/* Agent Instruction */}
        <InputGroup label="Instrucción" errors={errors.instruction}>
          <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2">
            ¿Tienes duda de cómo comenzar? Visita nuestro{" "}
            <a target="_blank" rel="noopener noreferrer" className="underline">
              knowledge base
            </a>
          </p>
          <TextArea
            placeholder="Descripción del agente"
            register={register("instruction", {
              required: "La descripción es obligatoria",
            })}
            error={errors.instruction?.message}
            rows={8}
          />
          <div className="flex gap-[16px] justify-start">
            <div className="group relative">
              <button
                type="button"
                className="w-auto h-[24px] px-[12px] text-sofia-superDark font-medium text-[12px] border-sofia-superDark border-[1px] rounded-[4px] hover:bg-gray-100 transition-colors"
                onClick={() => setExample("example1")}
              >
                {EXAMPLES_TITLES.example1}
              </button>
              <div className="absolute z-10 left-0 bottom-full mb-2 hidden group-hover:block bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded whitespace-normal w-[180px]">
                {EXAMPLES_SUMMARIES.example1}
              </div>
            </div>
            <div className="group relative">
              <button
                type="button"
                className="w-auto h-[24px] px-[12px] text-sofia-superDark font-medium text-[12px] border-sofia-superDark border-[1px] rounded-[4px] hover:bg-gray-100 transition-colors"
                onClick={() => setExample("example2")}
              >
                {EXAMPLES_TITLES.example2}
              </button>
              <div className="absolute z-10 left-0 bottom-full mb-2 hidden group-hover:block bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded whitespace-normal w-[180px]">
                {EXAMPLES_SUMMARIES.example2}
              </div>
            </div>
            <div className="group relative">
              <button
                type="button"
                className="w-auto h-[24px] px-[12px] text-sofia-superDark font-medium text-[12px] border-sofia-superDark border-[1px] rounded-[4px] hover:bg-gray-100 transition-colors"
                onClick={() => setExample("example3")}
              >
                {EXAMPLES_TITLES.example3}
              </button>
              <div className="absolute z-10 left-0 bottom-full mb-2 hidden group-hover:block bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded whitespace-normal w-[180px]">
                {EXAMPLES_SUMMARIES.example3}
              </div>
            </div>
          </div>
        </InputGroup>

        {/* Agent features */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Características del agente:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: "🤖",
                title: "Procesamiento inteligente",
                description:
                  "Utiliza IA avanzada para entender y responder consultas",
              },
              {
                icon: "⚡",
                title: "Respuestas rápidas",
                description: "Proporciona información inmediata a los usuarios",
              },
              {
                icon: "📚",
                title: "Aprendizaje continuo",
                description: "Mejora con cada interacción y nueva información",
              },
              {
                icon: "🔧",
                title: "Personalizable",
                description:
                  "Puedes configurar sus respuestas y comportamiento",
              },
            ].map(feature => (
              <div
                key={feature.title}
                className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Próximos pasos para tu agente:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-sofia-electricGreen mr-2">•</span>
              <span className="text-sm text-gray-600">
                Agrega información a la base de conocimiento en el siguiente
                paso
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sofia-electricGreen mr-2">•</span>
              <span className="text-sm text-gray-600">
                Personaliza las respuestas y el comportamiento después de la
                configuración inicial
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sofia-electricGreen mr-2">•</span>
              <span className="text-sm text-gray-600">
                Configura funciones adicionales para expandir las capacidades
              </span>
            </li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};

export default AgentStep;
