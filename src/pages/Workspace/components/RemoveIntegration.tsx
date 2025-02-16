import React from "react";

import RawModal from "@components/RawModal";

interface AddWebchatProps {
  isOpen: boolean;
  onClose: () => void;
}

const RemoveIntegration: React.FC<AddWebchatProps> = ({ isOpen, onClose }) => {
  const handleRemoveIntegration = () => {
    console.log("Integration removed");
  };
  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <div className="flex flex-col w-[600px] bg-white p-[24px] rounded-[16px]">
        <p>¿Estás seguro de que deseas eliminar esta integración?</p>
        <div className="flex justify-end mt-[24px]">
          <button
            type="button"
            className="text-sofia-superDark font-bold text-[14px] mr-[16px]"
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
