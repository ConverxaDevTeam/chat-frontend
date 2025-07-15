import React, { useState, useEffect, useRef } from "react";
import { StepComponentProps } from "../types";
import StepContainer from "../components/StepContainer";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";
import { urlFiles } from "@config/config";
import { alertConfirm } from "@utils/alerts";
import { getIntegrationWebChat } from "@services/integration";

const CorsTagList = ({
  cors,
  onRemove,
}: {
  cors: string[];
  onRemove: (cor: string) => void;
}) => (
  <div className="flex gap-[10px] flex-wrap">
    {cors.map((cor, index) => (
      <div
        key={`cor-${index}`}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-sofia-darkBlue"
      >
        <p className="truncate text-sofia-superDark text-xs font-normal">
          {cor}
        </p>
        <button
          onClick={() => onRemove(cor)}
          className="flex-none w-4 h-4 hover:text-sofia-electricGreen"
          aria-label="Eliminar dominio"
          title="Eliminar dominio"
        >
          <img src="/mvp/trash.svg" alt="Eliminar dominio" />
        </button>
      </div>
    ))}
  </div>
);

const CorsInput = ({
  value,
  onChange,
  onAdd,
}: {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}) => (
  <div className="w-full mb-[16px]">
    <InputGroup label="">
      <div className="relative w-full">
        <Input
          type="text"
          value={value}
          placeholder="https://tu-dominio.com"
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          className="text-sofia-superDark text-xs font-normal pr-14 w-full"
        />
        <button
          type="button"
          onClick={onAdd}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10"
          aria-label="Agregar dominio"
          title="Agregar dominio"
        >
          <img src="/mvp/plus.svg" alt="Agregar dominio" />
        </button>
      </div>
    </InputGroup>
  </div>
);

const ScriptViewer = ({
  script,
  onCopy,
}: {
  script: string;
  onCopy: () => void;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sofia-superDark text-[16px] font-normal leading-[16px]">
      Script de Integración
    </label>
    <p className="text-sofia-navyBlue text-[12px]">
      <span className="font-bold">Instrucción de Integración:</span> Copia y
      pega el siguiente script{" "}
      <span className="font-bold">
        dentro de la etiqueta{" "}
        <code className="bg-gray-100 px-1 rounded">&lt;head&gt;</code>
      </span>{" "}
      de tu sitio web, justo como se muestra a continuación:
    </p>

    <div className="bg-[#FCFCFC] rounded p-3 my-2 border border-sofia-darkBlue font-mono text-sm relative">
      <button
        onClick={onCopy}
        type="button"
        className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700 w-[24px] h-[24px]"
        aria-label="Copiar script"
        title="Copiar script"
      >
        <img src="/mvp/copy.svg" alt="Copiar script" />
      </button>
      <div className="text-gray-500">&lt;head&gt;</div>
      <div className="pl-4 text-gray-600">...</div>
      <div className="pl-4 text-green-500">{script}</div>
      <div className="text-gray-500">&lt;/head&gt;</div>
    </div>

    <p className="text-sofia-navyBlue text-[12px]">
      Este paso es necesario para habilitar el Web Chat de Sofia en tu sitio.
    </p>
  </div>
);

const IntegrationStep: React.FC<StepComponentProps> = ({
  data,
  updateData,
  organizationId,
  departmentId,
  integrationId: propIntegrationId,
  setIntegrationId: setParentIntegrationId,
}) => {
  const [domain, setDomain] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [integrationId, setIntegrationId] = useState<string>(
    "YOUR_INTEGRATION_ID"
  );
  const hasLoadedRef = useRef<boolean>(false);

  // Cargar dominios existentes al inicializar el componente
  useEffect(() => {
    const loadExistingDomains = async () => {
      if (!organizationId || !departmentId || hasLoadedRef.current) return;

      hasLoadedRef.current = true;
      setIsLoading(true);

      try {
        const integrationData = await getIntegrationWebChat(
          departmentId,
          organizationId
        );

        if (integrationData?.id) {
          setIntegrationId(integrationData.id);
          // También actualizar el integrationId en el parent component
          if (
            setParentIntegrationId &&
            typeof integrationData.id === "number"
          ) {
            setParentIntegrationId(integrationData.id);
          }
        }

        if (integrationData?.config?.cors) {
          // Actualizar los dominios en el formData si existen
          updateData("integration", {
            domains: integrationData.config.cors,
          });
        }
      } catch (error) {
        console.error("Error loading existing domains:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingDomains();
  }, [organizationId, departmentId]);

  const handleAddDomain = () => {
    if (!domain) return;
    if (data.integration.domains.includes(domain)) return;
    updateData("integration", {
      domains: [...data.integration.domains, domain],
    });
    setDomain("");
  };

  const handleRemoveDomain = (cor: string) => {
    updateData("integration", {
      domains: data.integration.domains.filter(d => d !== cor),
    });
  };

  const generatedScript = `<script src="${urlFiles}/sofia-chat/CI${propIntegrationId || integrationId}.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(generatedScript)
      .then(() => alertConfirm("Script copiado al portapapeles"))
      .catch(error => console.error("Error al copiar:", error));
  };

  return (
    <StepContainer
      title="Integra el chat"
      subtitle="Copia el pequeño código y colócalo en tu sitio web para activarlo."
    >
      <div className="flex flex-col gap-[24px] w-full max-w-[1000px] overflow-y-auto pr-[20px]">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Cargando configuración existente...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sofia-superDark text-[16px] font-normal leading-[16px]">
                Dominios
              </label>
              <p className="text-sofia-navyBlue text-[12px]">
                Escribe el dominio donde deseas mostrar el Web Chat (por eje
                https://tu-sitio.com) y haz click en el botón + para agregarlo.{" "}
                <span className="font-bold">
                  Solo los dominios registrados aquí podrán cargar el Web Chat
                  por seguridad.
                </span>
              </p>
              <CorsInput
                value={domain}
                onChange={setDomain}
                onAdd={handleAddDomain}
              />
              {data.integration.domains.length > 0 && (
                <CorsTagList
                  cors={data.integration.domains}
                  onRemove={handleRemoveDomain}
                />
              )}
            </div>
            <ScriptViewer script={generatedScript} onCopy={handleCopy} />
          </>
        )}
      </div>
    </StepContainer>
  );
};

export default IntegrationStep;
