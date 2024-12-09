import Modal from "@components/Modal";
import { FunctionForm } from "./FunctionForm";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

interface FunctionEditModalProps {
  isShown: boolean;
  onClose: () => void;
  functionId?: number;
  initialData?: FunctionData<HttpRequestFunction>;
  onSuccess?: (data: FunctionData<HttpRequestFunction>) => void;
  isLoading?: boolean;
  error?: string | null;
  agentId: number;
}

export const FunctionEditModal = ({
  isShown,
  onClose,
  functionId,
  initialData,
  onSuccess,
  isLoading,
  agentId,
}: FunctionEditModalProps) => {
  const handleSuccess = (data: FunctionData<HttpRequestFunction>) => {
    if (onSuccess) {
      onSuccess(data);
    }
    onClose();
  };

  return (
    <Modal
      isShown={isShown}
      onClose={onClose}
      header={
        <h2 className="text-xl font-semibold">
          {functionId ? "Editar Función" : "Nueva Función"}
        </h2>
      }
    >
      <FunctionForm
        functionId={functionId}
        initialData={initialData}
        onSuccess={handleSuccess}
        isLoading={isLoading}
        agentId={agentId}
      />
    </Modal>
  );
};
