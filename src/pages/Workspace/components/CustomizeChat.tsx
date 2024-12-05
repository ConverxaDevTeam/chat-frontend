import Loading from "@components/Loading";
import { urlFiles } from "@config/config";
import { getIntegrationWebChat } from "@services/integration";
import { RootState } from "@store";
import { alertConfirm } from "@utils/alerts";
import { useEffect, useState } from "react";
import { HiOutlineClipboard } from "react-icons/hi";
import { useSelector } from "react-redux";
import ChatEditor from "./ChatEditor";

interface CustomizeChatProps {
  onClose: () => void;
}
export enum IntegracionType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export interface ConfigWebChat {
  title: string;
  sub_title: string;
  description: string;
  cors: string[];
  logo: string;
  horizontal_logo: string | null;
  icon_chat: string;
  icon_close: string;
}

export interface Integracion {
  id: number;
  created_at: string;
  updated_at: string;
  type: IntegracionType;
  config: ConfigWebChat;
}

const CustomizeChat = ({ onClose }: CustomizeChatProps) => {
  const [integration, setIntegration] = useState<Integracion | null>(null);
  const { department } = useSelector((state: RootState) => state.chat);
  const [viwer, setViwer] = useState("interface");
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const searchIntegrationWebChat = async (
    departmentId: number,
    selectOrganizationId: number
  ) => {
    const response = await getIntegrationWebChat(
      departmentId,
      selectOrganizationId
    );
    if (response) {
      setIntegration(response);
    }
  };

  const handleCopy = () => {
    if (!integration) return alertConfirm("No se ha podido copiar el script");
    navigator.clipboard
      .writeText(generatedScript(integration?.id))
      .then(() => alertConfirm("Script copiado al portapapeles"))
      .catch(error => console.error("Error al copiar:", error));
  };

  const generatedScript = (integrationId: number) =>
    `<script src="${urlFiles}/sofia-chat/CI${integrationId}.js"></script>`;

  useEffect(() => {
    if (department && selectOrganizationId) {
      searchIntegrationWebChat(department?.id, selectOrganizationId);
    }
  }, []);

  return (
    <div className="w-[700px] bg-white p-[20px] shadow-lg rounded-md">
      {integration ? (
        <div className="flex flex-col gap-[20px] min-h-[400px]">
          <div className="flex w-full">
            <button
              onClick={() => setViwer("script")}
              className={`${
                viwer === "script"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex-1 py-2 rounded-tl-md`}
            >
              Script
            </button>
            <button
              onClick={() => setViwer("text")}
              className={`${
                viwer === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex-1 py-2`}
            >
              Textos
            </button>
            <button
              onClick={() => setViwer("interface")}
              className={`${
                viwer === "interface"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex-1 py-2 rounded-tr-md`}
            >
              Interface
            </button>
          </div>
          {viwer === "script" && (
            <div className="flex flex-col gap-[10px]">
              <label className="block text-sm font-medium text-gray-600">
                Script de Integración
              </label>
              <div className="grid grid-cols-[1fr_auto] bg-gray-50 p-4 rounded-md border border-gray-200 shadow-inner">
                <div className="text-gray-800 text-sm font-mono leading-tight whitespace-pre-wrap break-all">
                  {generatedScript(integration.id)}
                </div>
                <button
                  onClick={handleCopy}
                  type="button"
                  className="text-gray-500 hover:text-gray-700 ml-2"
                  aria-label="Copiar script"
                >
                  <HiOutlineClipboard size={24} className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          {viwer === "text" && (
            <div className="flex flex-col gap-[10px]">
              <label className="block text-sm font-medium text-gray-600">
                Textos
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Título
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md p-2"
                    value={integration.config.title}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md p-2"
                    value={integration.config.sub_title}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Descripción
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-md p-2"
                    value={integration.config.description}
                  />
                </div>
              </div>
            </div>
          )}
          {viwer === "interface" && <ChatEditor integration={integration} />}
          <div className="flex justify-end space-x-2 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 shadow"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CustomizeChat;
