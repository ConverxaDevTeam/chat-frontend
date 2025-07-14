import { useState, useEffect } from "react";
import { getIntegrationWebChat } from "@services/integration";

interface ChatConfig {
  title?: string;
  sub_title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ChatConfigVerificationResult {
  hasChatConfig: boolean;
  needsChatConfig: boolean;
  chatConfig: ChatConfig | null;
  integrationId: number | null;
  loading: boolean;
  error: string | null;
}

export const useChatConfigVerification = (
  organizationId?: number,
  departmentId?: number
): ChatConfigVerificationResult => {
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null);
  const [integrationId, setIntegrationId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatConfig = async () => {
      if (!organizationId || !departmentId) {
        // Si no hay organización o departamento, resetear estados
        setChatConfig(null);
        setIntegrationId(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Verificar si ya existe configuración de chat a través de la integración web chat
        const response = await getIntegrationWebChat(
          departmentId,
          organizationId
        );

        if (response && response.id) {
          setIntegrationId(response.id);
          setChatConfig((response.config as ChatConfig) || null);
        } else {
          setChatConfig(null);
          setIntegrationId(null);
        }
      } catch (err: unknown) {
        // Si no existe configuración, no es un error crítico
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            setChatConfig(null);
            setIntegrationId(null);
          } else {
            setError("Error al cargar configuración de chat");
          }
        } else {
          setError("Error al cargar configuración de chat");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChatConfig();
  }, [organizationId, departmentId]);

  const hasChatConfig =
    chatConfig !== null &&
    !!chatConfig?.title &&
    !!(chatConfig?.sub_title || chatConfig?.description);

  // Si no hay organizationId o departmentId, no necesita configuración (pasos anteriores no completados)
  const needsChatConfig =
    !organizationId || !departmentId ? false : !hasChatConfig;

  return {
    hasChatConfig,
    needsChatConfig,
    chatConfig,
    integrationId,
    loading,
    error,
  };
};
