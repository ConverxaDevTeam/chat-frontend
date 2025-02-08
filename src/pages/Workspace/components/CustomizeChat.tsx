import {
  getIntegrationWebChat,
  updateIntegrationWebChat,
  updateIntegrationLogo,
  deleteIntegrationLogo,
} from "@services/integration";
import { RootState } from "@store";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatEditor from "./ChatEditor";
import EditTexts from "./EditTexts";
import EditCors from "./EditCors";
import ConfigPanel from "@components/ConfigPanel";
import { Button } from "@components/common/Button";

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
  onSave,
  onCancel,
  saveText = "Guardar",
  cancelText = "Cancelar",
}) => (
  <div className="flex gap-[10px]">
    <Button onClick={onCancel} className="w-[134px]">
      {cancelText}
    </Button>
    <Button variant="primary" onClick={onSave}>
      {saveText}
    </Button>
  </div>
);

const useIntegrationData = (
  organizationId: number | null,
  departmentId: number | null
) => {
  const [integration, setIntegration] = useState<Integracion | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSaveLogo = async (logo: Blob): Promise<boolean> => {
    if (!integration) return false;
    try {
      const success = await updateIntegrationLogo(integration.id, logo);
      if (success) {
        setIntegration(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            config: {
              ...prev.config,
              logo: URL.createObjectURL(logo),
            },
          };
        });
      }
      return !!success;
    } catch (error) {
      console.error("Error saving logo:", error);
      return false;
    }
  };

  const handleDeleteLogo = async (): Promise<boolean> => {
    if (!integration) return false;
    try {
      const success = await deleteIntegrationLogo(integration.id);
      if (success) {
        setIntegration(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            config: {
              ...prev.config,
              logo: "",
            },
          };
        });
      }
      return success;
    } catch (error) {
      console.error("Error deleting logo:", error);
      return false;
    }
  };

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

  return {
    integration,
    setIntegration,
    loading,
    handleSaveChat,
    handleSaveLogo,
    handleDeleteLogo,
  };
};

const useTabNavigation = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabs = [
    {
      id: "cors",
      label: "Scripts",
      icon: <img src="/mvp/square-code.svg" className="w-5 h-5" />,
    },
    {
      id: "text",
      label: "Configuración del chat",
      icon: <img src="/mvp/settings.svg" className="w-5 h-5" />,
    },
    {
      id: "interface",
      label: "Diseño de interfase",
      icon: <img src="/mvp/palette.svg" className="w-5 h-5" />,
    },
  ];

  return { activeTab, setActiveTab, tabs };
};

interface IntegrationContentProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
  activeTab: string;
  handleSaveLogo: (logo: Blob) => Promise<boolean>;
  handleDeleteLogo: () => Promise<boolean>;
}

const IntegrationContent: FC<IntegrationContentProps> = ({
  integration,
  setIntegration,
  activeTab,
  handleSaveLogo,
  handleDeleteLogo,
}) => {
  switch (activeTab) {
    case "cors":
      return (
        <EditCors integration={integration} setIntegration={setIntegration} />
      );
    case "text":
      return (
        <EditTexts
          integration={integration}
          setIntegration={setIntegration}
          handleSaveLogo={handleSaveLogo}
          handleDeleteLogo={handleDeleteLogo}
        />
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

  const {
    integration,
    setIntegration,
    loading,
    handleSaveChat,
    handleSaveLogo,
    handleDeleteLogo,
  } = useIntegrationData(
    selectOrganizationId || null,
    selectedDepartmentId || null
  );
  const { activeTab, setActiveTab, tabs } = useTabNavigation("cors");

  return (
    <ConfigPanel
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      isLoading={loading}
      actions={<ActionButtons onCancel={onClose} onSave={handleSaveChat} />}
    >
      {integration && (
        <IntegrationContent
          integration={integration}
          setIntegration={setIntegration}
          activeTab={activeTab}
          handleSaveLogo={handleSaveLogo}
          handleDeleteLogo={handleDeleteLogo}
        />
      )}
    </ConfigPanel>
  );
};

export default CustomizeChat;
