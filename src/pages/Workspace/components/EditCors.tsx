import { alertConfirm } from "@utils/alerts";
import { Integracion } from "./CustomizeChat";
import { urlFiles } from "@config/config";
import { useState } from "react";
import { InputGroup } from "@components/forms/inputGroup";
import { Input } from "@components/forms/input";

interface EditCorsProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}

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
  <div className="w-full">
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
  <InputGroup label="Script de Integración">
    <div className="flex p-[12px] justify-between items-center gap-10 self-stretch rounded-lg border border-sofia-darkBlue">
      <div className="flex-1 truncate text-sofia-superDark text-xs font-normal">
        {script}
      </div>
      <button
        onClick={onCopy}
        type="button"
        className="flex-none text-gray-500 hover:text-gray-700 w-[24px] h-[24px]"
        aria-label="Copiar script"
        title="Copiar script"
      >
        <img src="/mvp/copy.svg" alt="Copiar script" />
      </button>
    </div>
  </InputGroup>
);

const useDomainManager = (
  integration: Integracion,
  setIntegration: (i: Integracion) => void
) => {
  const [domain, setDomain] = useState<string>("");

  const handleAddDomain = () => {
    if (!domain) return;
    if (integration.config.cors.includes(domain)) return;
    setIntegration({
      ...integration,
      config: {
        ...integration.config,
        cors: [...integration.config.cors, domain],
      },
    });
    setDomain("");
  };

  const handleRemoveDomain = (cor: string) => {
    setIntegration({
      ...integration,
      config: {
        ...integration.config,
        cors: integration.config.cors.filter(string => string !== cor),
      },
    });
  };

  return { domain, setDomain, handleAddDomain, handleRemoveDomain };
};

const useScriptManager = (integrationId: number) => {
  const generatedScript = `<script src="${urlFiles}/sofia-chat/CI${integrationId}.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(generatedScript)
      .then(() => alertConfirm("Script copiado al portapapeles"))
      .catch(error => console.error("Error al copiar:", error));
  };

  return { script: generatedScript, handleCopy };
};

const EditCors = ({ integration, setIntegration }: EditCorsProps) => {
  const { domain, setDomain, handleAddDomain, handleRemoveDomain } =
    useDomainManager(integration, setIntegration);
  const { script, handleCopy } = useScriptManager(integration.id);

  return (
    <div className="flex flex-col gap-[24px] w-full max-w-[1000px] overflow-y-auto pr-[20px]">
      <div className="flex flex-col gap-[16px]">
        <label className="text-sofia-superDark text-[14px] font-normal leading-[16px]">
          Dominios
        </label>
        <CorsInput value={domain} onChange={setDomain} onAdd={handleAddDomain} />
        {integration.config.cors.length > 0 && (
          <CorsTagList
            cors={integration.config.cors}
            onRemove={handleRemoveDomain}
          />
        )}
      </div>
      <ScriptViewer script={script} onCopy={handleCopy} />
    </div>
  );
};

export default EditCors;
