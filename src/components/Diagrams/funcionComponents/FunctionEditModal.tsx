import Modal from "@components/Modal";
import { FunctionForm } from "./FunctionForm";
import {
  FunctionData,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

interface FunctionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  functionId?: number;
  initialData?: FunctionData<HttpRequestFunction>;
  onSuccess?: (data: FunctionData<HttpRequestFunction>) => void;
  isLoading?: boolean;
  error?: string | null;
  agentId?: number;
}

export const FunctionEditModal = ({
  isOpen,
  onClose,
  functionId,
  initialData,
  onSuccess,
  isLoading,
  error,
  agentId,
}: FunctionEditModalProps) => {
  const handleSuccess = (data: FunctionData<HttpRequestFunction>) => {
    if (onSuccess) {
      onSuccess(data);
    }
  };
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
      <div className="space-y-4">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <FunctionForm
          functionId={functionId}
          initialData={initialData}
          onSuccess={handleSuccess}
          isLoading={isLoading}
          agentId={agentId}
        />
      </div>
    </Modal>
  );
};
