import { useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { assignConversationToHitl } from "@services/conversations";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

interface UseHitlProps {
  conversationId: number;
  userId: number;
  currentUserId: number;
  onUpdateConversation: () => void;
}

export const useHitl = ({
  conversationId,
  userId,
  currentUserId,
  onUpdateConversation,
}: UseHitlProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showConfirmation } = useAlertContext();

  const handleHitlAction = async () => {
    setIsLoading(true);
    try {
      const updatedConversation =
        await assignConversationToHitl(conversationId);
      toast.success("Conversación asignada exitosamente");
      if (updatedConversation) {
        onUpdateConversation();
      }
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 400) {
        const result = await showConfirmation({
          title: "Conversación ya asignada",
          text: "¿Deseas reasignar esta conversación?",
          confirmButtonText: "Sí, reasignar",
          cancelButtonText: "Cancelar",
        });

        if (result) {
          try {
            const reassignedConversation =
              await assignConversationToHitl(conversationId);
            if (reassignedConversation) {
              onUpdateConversation();
              toast.success("Conversación reasignada exitosamente");
            }
          } catch (reassignError) {
            toast.error("Error al reasignar la conversación");
          }
        }
      } else {
        toast.error(
          userId === currentUserId
            ? "Error al desasignar la conversación"
            : "Error al asignar la conversación"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleHitlAction,
    isLoading,
  };
};
