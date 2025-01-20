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
        className="w-full text-left"
        onClick={() => {
          exportConversation(
            organizationId,
            conversation.id,
            "csv",
            conversation
          );
        }}
      >
        Exportar Chat CSV
      </button>
      <button
        className="w-full text-left"
        onClick={() => {
          exportConversation(
            organizationId,
            conversation.id,
            "pdf",
            conversation
          );
        }}
      >
        Exportar Chat PDF
      </button>
      <button
        className="w-full text-left"
        onClick={() => {
          exportConversation(
            organizationId,
            conversation.id,
            "excel",
            conversation
          );
        }}
      >
        Exportar Chat EXCEL
      </button>
      <button className="w-full text-left text-red-500" onClick={onDelete}>
        Eliminar Chat
      </button>
    </ContextMenu>
  );
};
