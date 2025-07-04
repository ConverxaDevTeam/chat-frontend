import React, { useState, useEffect } from "react";
import { getConversationHistory } from "@services/conversations";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

interface ConversationHistory {
  id: number;
  created_at: string;
  messages: Array<{
    id: number;
    text: string;
    created_at: string;
    is_from_user: boolean;
  }>;
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
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && chatUserSecret) {
      setPage(1);
      setConversations([]);
      setHasMore(true);
      fetchHistory(1, false);
    }
  }, [isOpen, chatUserSecret, organizationId]);

  const fetchHistory = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await getConversationHistory(
        organizationId,
        chatUserSecret
      );

      if (response.ok) {
        if (append) {
          setConversations(prev => [...prev, ...response.conversations]);
        } else {
          setConversations(response.conversations);
        }
        // Asumiendo que si hay menos de 10 elementos, no hay más páginas
        setHasMore(response.conversations.length === 10);
      } else {
        setError("No se pudo cargar el historial");
      }
    } catch (err) {
      setError("Error al cargar el historial");
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

  const getConversationPreview = (conversation: ConversationHistory) => {
    if (!conversation.messages || conversation.messages.length === 0)
      return "Sin mensajes";

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const messageText = lastMessage.text;

    // Truncar como en la imagen
    return messageText.length > 60
      ? messageText.substring(0, 60) + "..."
      : messageText;
  };

  const handleConversationClick = (conversationId: number) => {
    navigate(`/conversation/detail/${conversationId}`);
    onClose();
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage, true);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 5 &&
      hasMore &&
      !loadingMore
    ) {
      loadMore();
    }
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
          className="w-full py-2 px-4 bg-sofia-superDark text-white rounded-[4px] hover:bg-sofia-darkLight transition-colors satoshi-medium"
        >
          Cerrar
        </button>
      }
    >
      <div className="w-full min-w-[800px]">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofia-superDark mx-auto mb-4"></div>
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
              onClick={() => fetchHistory(1, false)}
              className="px-4 py-2 bg-sofia-superDark text-white rounded-[4px] hover:bg-sofia-darkLight transition-colors satoshi-medium"
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
          <div
            className="space-y-4 max-h-96 overflow-y-auto"
            onScroll={handleScroll}
          >
            {conversations.map((conversation, index) => (
              <div
                key={`${conversation.id}-${index}`}
                className="border border-gray-200 rounded-[4px] p-6 hover:bg-gray-50 cursor-pointer transition-colors min-w-[750px]"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-base satoshi-medium text-sofia-superDark">
                    {formatConversationDate(conversation.created_at)}
                  </span>
                  <span className="text-sm text-gray-500 satoshi-regular">
                    Conversación
                  </span>
                </div>
                <p className="text-base text-gray-600 leading-relaxed satoshi-regular">
                  {getConversationPreview(conversation)}
                </p>
              </div>
            ))}

            {loadingMore && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sofia-superDark"></div>
                <span className="ml-2 text-sm text-gray-600 satoshi-regular">
                  Cargando más...
                </span>
              </div>
            )}

            {!hasMore && conversations.length > 0 && (
              <div className="text-center py-4">
                <span className="text-xs text-gray-500 satoshi-regular">
                  No hay más conversaciones
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConversationHistoryModal;
