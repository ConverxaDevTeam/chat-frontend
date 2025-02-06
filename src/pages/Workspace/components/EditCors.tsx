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
        >
          <img src="/mvp/trash.svg" alt="Eliminar" />
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
  <div className="grid grid-cols-[1fr_auto] gap-[10px] items-end">
    <InputGroup label="Dominio">
      <Input
        type="text"
        value={value}
        placeholder="https://tu-dominio.com"
        onChange={e => onChange(e.target.value)}
        className="text-sofia-superDark text-xs font-normal"
      />
    </InputGroup>
    <button
      type="button"
      onClick={onAdd}
      className="flex h-[55px] p-[15px] items-center gap-[11px] rounded-lg bg-sofia-electricOlive text-sofia-superDark text-center text-sm font-semibold"
    >
      Agregar
    </button>
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
      >
        <img src="/mvp/copy.svg" alt="Copiar" />
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
    <div className="flex flex-col gap-[24px] w-[375px]">
      <label className="text-sofia-superDark text-[14px] font-semibold leading-[16px]">
        Dominios
      </label>
      <CorsTagList
        cors={integration.config.cors}
        onRemove={handleRemoveDomain}
      />
      <CorsInput value={domain} onChange={setDomain} onAdd={handleAddDomain} />
      <ScriptViewer script={script} onCopy={handleCopy} />
    </div>
  );
};

export default EditCors;
