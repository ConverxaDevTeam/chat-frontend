import Loading from "@components/Loading";
import { urlFiles } from "@config/config";
import { getIntegrationWebChat } from "@services/integration";
import { RootState } from "@store";
import { alertConfirm } from "@utils/alerts";
import { useEffect, useState } from "react";
import { HiOutlineClipboard } from "react-icons/hi";
import { useSelector } from "react-redux";

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
    `<script src="${urlFiles}/sofia-chat/${integrationId}.js"></script>`;

  useEffect(() => {
    if (department && selectOrganizationId) {
      searchIntegrationWebChat(department?.id, selectOrganizationId);
    }
  }, []);

  return integration ? (
    <div>
      <div>
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
      <div className="flex justify-end space-x-2">
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
  );
};

export default CustomizeChat;
