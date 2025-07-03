import React, { useState, useEffect } from "react";
import { getConversationHistory } from "@services/conversations";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

interface ConversationHistoryItem {
  id: number;
  created_at: string;
  message_text: string;
  message_created_at: string;
  message_type: string;
  department: string;
}

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
  chatUserSecret: string;
  userName?: string;
}

const ConversationHistoryModal: React.FC<ConversationHistoryModalProps> = ({
  isOpen,
  onClose,
  organizationId,
  chatUserSecret,
  userName,
}) => {
  const [conversations, setConversations] = useState<ConversationHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && chatUserSecret) {
      fetchHistory();
    }
  }, [isOpen, chatUserSecret, organizationId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching history for:", {
        organizationId,
        chatUserSecret,
      });
      const response = await getConversationHistory(
        organizationId,
        chatUserSecret
      );
      console.log("History response:", response);
      if (response.ok) {
        setConversations(response.conversations);
        console.log("Conversations set:", response.conversations);
      } else {
        setError("No se pudo cargar el historial");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  const formatConversationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getConversationPreview = (conversation: ConversationHistoryItem) => {
    if (!conversation.message_text) return "Sin mensajes";

    // Truncar como en la imagen
    return conversation.message_text.length > 60
      ? conversation.message_text.substring(0, 60) + "..."
      : conversation.message_text;
  };

  const handleConversationClick = (conversationId: number) => {
    navigate(`/conversation/detail/${conversationId}`);
    onClose();
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <div className="flex items-center gap-3">
          <img
            src="/mvp/messages-square.svg"
            alt="Historial"
            className="w-5 h-5"
          />
          <div>
            <span className="satoshi-bold text-sofia-superDark">
              Historial de conversaciones
            </span>
            {userName && (
              <p className="text-sm text-gray-600 satoshi-regular mt-1">
                {userName}
              </p>
            )}
          </div>
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-sofia-electricGreen text-sofia-superDark rounded-[4px] hover:bg-opacity-90 transition-colors satoshi-medium"
        >
          Cerrar
        </button>
      }
    >
      <div className="w-full max-w-md">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofia-electricGreen mx-auto mb-4"></div>
              <p className="text-gray-600 satoshi-regular">
                Cargando historial...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <img
              src="/mvp/circle-alert.svg"
              alt="Error"
              className="w-12 h-12 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-600 satoshi-regular mb-4">{error}</p>
            <button
              onClick={fetchHistory}
              className="px-4 py-2 bg-sofia-electricGreen text-sofia-superDark rounded-[4px] hover:bg-opacity-90 transition-colors satoshi-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="text-center py-8">
            <img
              src="/mvp/messages-square.svg"
              alt="Sin historial"
              className="w-12 h-12 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-600 satoshi-regular">
              No hay conversaciones anteriores
            </p>
          </div>
        )}

        {!loading && !error && conversations.length > 0 && (
          <div className="space-y-4">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className="border border-gray-200 rounded-[4px] p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm satoshi-medium text-sofia-superDark">
                    {formatConversationDate(conversation.created_at)}
                  </span>
                  <span className="text-xs text-gray-500 satoshi-regular">
                    {conversation.department}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed satoshi-regular">
                  {getConversationPreview(conversation)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConversationHistoryModal;
