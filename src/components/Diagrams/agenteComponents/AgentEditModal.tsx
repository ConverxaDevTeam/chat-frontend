import Modal from "@components/Modal";
import { AgenteForm } from "./AgenteForm";

interface AgentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: number;
  initialData?: {
    name: string;
    description: string;
  };
  onSuccess: () => void;
}

export const AgentEditModal = ({
  isOpen,
  onClose,
  agentId,
  initialData,
  onSuccess,
}: AgentEditModalProps) => {
  return (
    <Modal isShown={isOpen} onClose={onClose}>
      <AgenteForm
        agentId={agentId}
        initialData={initialData}
        onSuccess={onSuccess}
        onClose={onClose}
      />
    </Modal>
  );
};
