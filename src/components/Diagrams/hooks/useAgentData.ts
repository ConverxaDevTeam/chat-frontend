import { Agent } from "@interfaces/agents";
import { agentService } from "@services/agent";
import { useState, useEffect, useCallback } from "react";

interface AgentData {
  name: string;
  description: string;
}

interface AgentDataState {
  isLoading: boolean;
  data: AgentData | null;
}

// Función para transformar la respuesta del agente al formato que necesitamos
const transformAgentData = (agent: Agent): AgentData => ({
  name: agent.name,
  description: agent.config.instruccion,
});

// Función para manejar errores
const handleFetchError = (error: unknown) => {
  console.error("Error fetching agent:", error);
  return null;
};

// Hook para manejar el estado de la carga
const useLoadingState = () => {
  const [state, setState] = useState<AgentDataState>({
    isLoading: false,
    data: null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setData = useCallback((data: AgentData | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return {
    state,
    setLoading,
    setData,
  };
};

export const useAgentData = (agentId: number | null, selected: boolean) => {
  const { state, setLoading, setData } = useLoadingState();

  const fetchAgent = useCallback(async () => {
    if (!agentId) return;

    setLoading(true);
    try {
      const fetchedAgent = await agentService.getAgentById(agentId);
      const transformedData = transformAgentData(fetchedAgent);
      setData(transformedData);
    } catch (error) {
      handleFetchError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [agentId, setLoading, setData]);

  useEffect(() => {
    if (!selected) return;
    fetchAgent();
  }, [selected, fetchAgent]);

  return {
    isLoading: state.isLoading,
    agentData: state.data,
    refreshAgentData: fetchAgent,
  };
};
