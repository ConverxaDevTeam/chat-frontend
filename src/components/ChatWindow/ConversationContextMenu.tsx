import { ConversationDetailResponse } from "@interfaces/conversation";
import { exportConversation } from "@services/conversations";
import ContextMenu from "../ContextMenu";

interface ConversationContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  conversation: ConversationDetailResponse;
  organizationId: number;
  onDelete: () => void;
  onShowHistory: () => void;
  onEditUserData: () => void;
}

export const ConversationContextMenu = ({
  position,
  onClose,
  conversation,
  organizationId,
  onDelete,
  onShowHistory,
  onEditUserData,
}: ConversationContextMenuProps) => {
  return (
    <ContextMenu position={position} onClose={onClose}>
      <button
        className="w-full text-left flex items-center gap-2"
        onClick={() => {
          onShowHistory();
          onClose();
        }}
      >
        <img src="/mvp/messages-square.svg" alt="" className="w-4 h-4" />
        Ver historial
      </button>
      <button
        className="w-full text-left flex items-center gap-2"
        onClick={() => {
          onEditUserData();
          onClose();
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Editar datos
      </button>
      <button
        className="w-full text-left flex items-center gap-2"
        onClick={() => {
          exportConversation(
            organizationId,
            conversation.id,
            "csv",
            conversation
          );
        }}
      >
        <img src="/mvp/download.svg" alt="" className="w-4 h-4" />
        Exportar chat CSV
      </button>
      <button
        className="w-full text-left flex items-center gap-2"
        onClick={() => {
          exportConversation(
            organizationId,
            conversation.id,
            "pdf",
            conversation
          );
        }}
      >
        <img src="/mvp/download.svg" alt="" className="w-4 h-4" />
        Exportar chat PDF
      </button>
      <button
        className="w-full text-left flex items-center gap-2"
        onClick={() => {
          exportConversation(
            organizationId,
            conversation.id,
            "excel",
            conversation
          );
        }}
      >
        <img src="/mvp/download.svg" alt="" className="w-4 h-4" />
        Exportar chat EXCEL
      </button>
      <button
        className="w-full text-left text-red-500 flex items-center gap-2"
        onClick={onDelete}
      >
        <img src="/mvp/trash.svg" alt="" className="w-4 h-4" />
        Eliminar chat
      </button>
    </ContextMenu>
  );
};
