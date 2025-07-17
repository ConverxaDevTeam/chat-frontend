import React from "react";

import RawModal from "@components/RawModal";
import { NodeData } from "@interfaces/workflow";
import { deleteIntegrationbyId } from "@services/integration";
import { useCounter } from "@hooks/CounterContext";

interface RemoveIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  data: NodeData;
}

const RemoveIntegration: React.FC<RemoveIntegrationProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { increment } = useCounter();
  const handleRemoveIntegration = async () => {
    if (!data.id) return;
    const respone = await deleteIntegrationbyId(data.id);
    if (respone) {
      onClose();
      // Use the counter context to trigger a diagram update instead of page reload
      increment();
    }
  };
  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[600px] bg-white p-[24px] rounded-[16px]">
        <p>¿Estás seguro de que deseas eliminar esta integración?</p>
        <div className="flex justify-end mt-[24px]">
          <button
            type="button"
            className="text-app-superDark font-bold text-[14px] mr-[16px]"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleRemoveIntegration}
            className="bg-red-500 text-white font-bold text-[14px] px-[16px] py-[8px] rounded-[8px]"
          >
            Eliminar
          </button>
        </div>
      </div>
    </RawModal>
  );
};

export default RemoveIntegration;
