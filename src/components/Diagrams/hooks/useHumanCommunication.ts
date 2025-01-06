import { useEffect, useState } from "react";
import { agentService } from "@services/agent";
import { useSweetAlert } from "@hooks/useSweetAlert";

export const useHumanCommunication = (agentId: number) => {
  const [humanCommunication, setHumanCommunication] = useState(true);
  const { handleOperation } = useSweetAlert();

  useEffect(() => {
    if (agentId) {
      agentService.getById(agentId).then(agent => {
        setHumanCommunication(agent.canEscalateToHuman);
      });
    }
  }, [agentId]);

  const handleHumanCommunicationToggle = async () => {
    if (!agentId) return;

    const result = await handleOperation(
      async () => {
        const updatedAgent = await agentService.updateEscalateToHuman(
          agentId,
          !humanCommunication
        );
        setHumanCommunication(updatedAgent.canEscalateToHuman);
        return updatedAgent;
      },
      {
        title: "Actualizando comunicación humana",
        successTitle: humanCommunication
          ? "Comunicación humana desactivada"
          : "Comunicación humana activada",
        successText: humanCommunication
          ? "El agente ya no podrá escalar conversaciones a un humano"
          : "El agente ahora podrá escalar conversaciones a un humano",
        errorTitle: "Error al actualizar la comunicación humana",
      }
    );

    if (!result.success) {
      console.error("Error updating human communication:", result.error);
    }
  };

  return { humanCommunication, handleHumanCommunicationToggle };
};
