import Modal from "@components/Modal";
import { FunctionForm } from "./FunctionForm";
import { HttpRequestFunction } from "@interfaces/functions.interface";

interface FunctionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  functionId?: number;
  initialData?: {
    name: string;
    description: string;
    config: HttpRequestFunction["config"];
  };
  onSuccess?: () => void;
}

export const FunctionEditModal = ({
  isOpen,
  onClose,
  functionId,
  initialData,
  onSuccess,
}: FunctionEditModalProps) => {
  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <h2 className="text-xl font-bold">
          {functionId ? "Editar Función" : "Nueva Función"}
        </h2>
      }
    >
      <FunctionForm
        functionId={functionId}
        initialData={initialData}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};
