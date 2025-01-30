import Loading from "@components/Loading";
import {
  getIntegrationWebChat,
  updateIntegrationWebChat,
} from "@services/integration";
import { RootState } from "@store";
import { FC, useEffect, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import ChatEditor from "./ChatEditor";
import EditTexts from "./EditTexts";
import EditCors from "./EditCors";
import ConfigPanel from "@components/ConfigPanel";

interface CustomizeChatProps {
  onClose: () => void;
}

export enum IntegracionType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export interface ConfigWebChat {
  id: number;
  name: string;
  cors: string[];
  url_assets: string;
  title: string;
  sub_title: string;
  description: string;
  logo: string;
  horizontal_logo: string;
  edge_radius: number;
  bg_color: string;
  bg_chat: string;
  bg_user: string;
  bg_assistant: string;
  text_color: string;
  text_date: string;
  button_color: string;
  text_title: string;
  message_radius: number;
  button_text: string;
}

export interface Integracion {
  id: number;
  created_at: string;
  updated_at: string;
  type: IntegracionType;
  config: ConfigWebChat;
}

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
}

const ActionButtons: FC<ActionButtonsProps> = ({
  onCancel,
  onSave,
  saveText = "Guardar",
  cancelText = "Cancelar",
}) => (
  <div className="flex justify-end space-x-2 mt-auto">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 rounded-md shadow bg-gray-300 text-gray-700 hover:bg-gray-400"
    >
      {cancelText}
    </button>
    <button
      type="button"
      onClick={onSave}
      className="px-4 py-2 rounded-md shadow bg-blue-600 text-white hover:bg-blue-700"
    >
      {saveText}
    </button>
  </div>
);

interface CustomizeContainerProps {
  children: ReactNode;
  isLoading?: boolean;
}

const CustomizeContainer: FC<CustomizeContainerProps> = ({
  children,
  isLoading,
}) => (
  <div className="w-[700px] bg-white p-[20px] shadow-lg rounded-md">
    {isLoading ? (
      <div className="w-full min-h-[400px] flex justify-center items-center">
        <Loading />
      </div>
    ) : (
      children
    )}
  </div>
);

const useIntegrationData = (
  organizationId: number | null,
  departmentId: number | null
) => {
  const [integration, setIntegration] = useState<Integracion | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSaveChat = async () => {
    if (!integration) return;
    const data = {
      cors: integration.config.cors,
      title: integration.config.title,
      name: integration.config.name,
      sub_title: integration.config.sub_title,
      description: integration.config.description,
      bg_color: integration.config.bg_color,
      text_title: integration.config.text_title,
      bg_chat: integration.config.bg_chat,
      text_color: integration.config.text_color,
      bg_assistant: integration.config.bg_assistant,
      bg_user: integration.config.bg_user,
      button_color: integration.config.button_color,
      button_text: integration.config.button_text,
      text_date: integration.config.text_date,
    };
    await updateIntegrationWebChat(integration.id, data);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!organizationId || !departmentId) {
        setLoading(false);
        return;
      }
      try {
        const response = await getIntegrationWebChat(
          departmentId,
          organizationId
        );
        if (response) setIntegration(response);
      } catch (error) {
        console.error("Error getting web chat integration:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organizationId, departmentId]);

  return { integration, setIntegration, loading, handleSaveChat };
};

const useTabNavigation = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabs = [
    { id: "cors", label: "Script" },
    { id: "text", label: "Textos" },
    { id: "interface", label: "Interface" },
  ];

  return { activeTab, setActiveTab, tabs };
};

interface IntegrationContentProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
  activeTab: string;
}

const IntegrationContent: FC<IntegrationContentProps> = ({
  integration,
  setIntegration,
  activeTab,
}) => {
  switch (activeTab) {
    case "cors":
      return (
        <EditCors integration={integration} setIntegration={setIntegration} />
      );
    case "text":
      return (
        <EditTexts integration={integration} setIntegration={setIntegration} />
      );
    case "interface":
      return (
        <ChatEditor integration={integration} setIntegration={setIntegration} />
      );
    default:
      return null;
  }
};

const CustomizeChat: FC<CustomizeChatProps> = ({ onClose }) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );

  const { integration, setIntegration, loading, handleSaveChat } =
    useIntegrationData(
      selectOrganizationId || null,
      selectedDepartmentId || null
    );
  const { activeTab, setActiveTab, tabs } = useTabNavigation("cors");

  return (
    <CustomizeContainer isLoading={loading}>
      {integration && (
        <div className="flex flex-col gap-[20px] min-h-[500px]">
          <ConfigPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          >
            <IntegrationContent
              integration={integration}
              setIntegration={setIntegration}
              activeTab={activeTab}
            />
          </ConfigPanel>
          <ActionButtons onCancel={onClose} onSave={handleSaveChat} />
        </div>
      )}
    </CustomizeContainer>
  );
};

export default CustomizeChat;
