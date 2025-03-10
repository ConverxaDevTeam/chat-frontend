import { ConversationDetailResponse } from "@interfaces/conversation";
import { exportConversation } from "@services/conversations";
import ContextMenu from "../ContextMenu";

interface ConversationContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  conversation: ConversationDetailResponse;
  organizationId: number;
  onDelete: () => void;
}

export const ConversationContextMenu = ({
  x,
  y,
  onClose,
  conversation,
  organizationId,
  onDelete,
}: ConversationContextMenuProps) => {
  return (
    <ContextMenu x={x} y={y} onClose={onClose}>
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
      <button className="w-full text-left text-red-500 flex items-center gap-2" onClick={onDelete}>
        <img src="/mvp/trash.svg" alt="" className="w-4 h-4" />
        Eliminar chat
      </button>
    </ContextMenu>
  );
};
