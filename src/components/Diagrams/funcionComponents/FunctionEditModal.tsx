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
    <Modal isShown={isShown} onClose={onClose}>
      <div className="flex gap-[18px] w-[487px] p-[8px]">
        <div className="flex-1 flex flex-col gap-[16px]">
          <FunctionForm
            functionId={functionId}
            initialData={initialData}
            onSuccess={handleSuccess}
            isLoading={isLoading}
            agentId={agentId}
            onCancel={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};
