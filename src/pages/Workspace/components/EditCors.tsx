import { alertConfirm } from "@utils/alerts";
import { Integracion } from "./CustomizeChat";
import { urlFiles } from "@config/config";
import { HiOutlineClipboard } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useState } from "react";

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
  <div className="flex gap-[10px] pb-2 flex-wrap">
    {cors.map((cor, index) => (
      <div
        key={`cor-${index}`}
        className="bg-app-c3 flex items-center gap-[5px] px-2 py-1 rounded-md"
      >
        <p>{cor}</p>
        <MdClose className="cursor-pointer" onClick={() => onRemove(cor)} />
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
  <div className="flex flex-col gap-[10px]">
    <label className="block text-sm font-medium text-gray-600">Cors</label>
    <input
      type="text"
      value={value}
      className="w-full border border-gray-200 rounded-md p-2"
      placeholder="https://tu-dominio.com"
      onChange={e => onChange(e.target.value)}
    />
    <button type="button" onClick={onAdd}>
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
  <>
    <label className="block text-sm font-medium text-gray-600">
      Script de Integración
    </label>
    <div className="grid grid-cols-[1fr_auto] bg-gray-50 p-4 rounded-md border border-gray-200 shadow-inner">
      <div className="text-gray-800 text-sm font-mono leading-tight whitespace-pre-wrap break-all">
        {script}
      </div>
      <button
        onClick={onCopy}
        type="button"
        className="text-gray-500 hover:text-gray-700 ml-2"
        aria-label="Copiar script"
      >
        <HiOutlineClipboard size={24} className="h-5 w-5" />
      </button>
    </div>
  </>
);

const EditCors = ({ integration, setIntegration }: EditCorsProps) => {
  const [domain, setDomain] = useState<string>("");

  const handleCopy = () => {
    if (!integration) return alertConfirm("No se ha podido copiar el script");
    navigator.clipboard
      .writeText(generatedScript(integration?.id))
      .then(() => alertConfirm("Script copiado al portapapeles"))
      .catch(error => console.error("Error al copiar:", error));
  };

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

  const generatedScript = (integrationId: number) =>
    `<script src="${urlFiles}/sofia-chat/CI${integrationId}.js"></script>`;

  return (
    <div className="flex flex-col gap-[10px]">
      <label className="block text-sm font-medium text-gray-600">Cors</label>
      <CorsTagList
        cors={integration.config.cors}
        onRemove={handleRemoveDomain}
      />
      <CorsInput value={domain} onChange={setDomain} onAdd={handleAddDomain} />
      <ScriptViewer
        script={generatedScript(integration.id)}
        onCopy={handleCopy}
      />
    </div>
  );
};

export default EditCors;
