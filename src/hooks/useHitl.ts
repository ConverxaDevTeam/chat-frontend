import { useState } from "react";
import { toast } from "react-toastify";
import { useSweetAlert } from "./useSweetAlert";
import { AxiosError } from "axios";
import { Conversation } from "@interfaces/conversation";
import { assignConversationToHitl } from "@services/conversations";

interface UseHitlProps {
  conversationId: number;
  userId?: string;
  currentUserId?: string;
  onUpdateConversation: (conversation: Conversation) => void;
}

export const useHitl = ({
  conversationId,
  userId,
  currentUserId,
  onUpdateConversation,
}: UseHitlProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showConfirmation } = useSweetAlert();

  const handleHitlAction = async () => {
    setIsLoading(true);
    try {
      const updatedConversation =
        await assignConversationToHitl(conversationId);
      if (updatedConversation) {
        onUpdateConversation(updatedConversation);
        toast.success(
          userId === currentUserId
            ? "Conversación desasignada exitosamente"
            : "Conversación asignada exitosamente"
        );
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
              onUpdateConversation(reassignedConversation);
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
