import { useState, useEffect } from "react";
import { getIntegrationWebChat } from "@services/integration";

export interface IntegrationVerificationResult {
  hasIntegration: boolean;
  needsIntegration: boolean;
  integrationConfig: unknown | null;
  integrationId: number | null;
  loading: boolean;
  error: string | null;
}

export const useIntegrationVerification = (
  organizationId?: number,
  departmentId?: number
): IntegrationVerificationResult => {
  const [integrationConfig, setIntegrationConfig] = useState<unknown | null>(
    null
  );
  const [integrationId, setIntegrationId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrationConfig = async () => {
      if (!organizationId || !departmentId) {
        // Si no hay organización o departamento, resetear estados
        setIntegrationConfig(null);
        setIntegrationId(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Verificar si ya existe configuración de integración web chat
        const response = await getIntegrationWebChat(
          departmentId,
          organizationId
        );

        if (response && response.id) {
          setIntegrationConfig(response);
          setIntegrationId(response.id);
        } else {
          setIntegrationConfig(null);
          setIntegrationId(null);
        }
      } catch (err: unknown) {
        // Si no existe configuración, no es un error crítico
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            setIntegrationConfig(null);
            setIntegrationId(null);
          } else {
            setError("Error al cargar configuración de integración");
          }
        } else {
          setError("Error al cargar configuración de integración");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationConfig();
  }, [organizationId, departmentId]);

  const hasIntegration = integrationConfig !== null && integrationId !== null;
  // Si no hay organizationId o departmentId, no necesita integración (pasos anteriores no completados)
  const needsIntegration =
    !organizationId || !departmentId ? false : !hasIntegration;

  return {
    hasIntegration,
    needsIntegration,
    integrationConfig,
    integrationId,
    loading,
    error,
  };
};
