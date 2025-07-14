import { useState, useEffect } from "react";
import { getWorkspaceData } from "@services/department";

export interface AgentVerificationResult {
  hasAgent: boolean;
  needsAgent: boolean;
  agentId: number | null;
  loading: boolean;
  error: string | null;
}

export const useAgentVerification = (
  departmentId?: number
): AgentVerificationResult => {
  const [agentId, setAgentId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!departmentId) {
        // Si no hay departamento, resetear estados
        setAgentId(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const workspaceData = await getWorkspaceData(departmentId);
        if (workspaceData?.department?.agente?.id) {
          setAgentId(workspaceData.department.agente.id);
        } else {
          setAgentId(null);
        }
      } catch (err) {
        setError("Error al cargar datos del agente");
        setAgentId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [departmentId]);

  const hasAgent = agentId !== null;
  // Si no hay departmentId, no necesita agente (paso anterior no completado)
  const needsAgent = !departmentId ? false : !hasAgent;

  return {
    hasAgent,
    needsAgent,
    agentId,
    loading,
    error,
  };
};
