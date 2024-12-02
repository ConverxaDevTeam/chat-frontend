import React from "react";
import Modal from "@components/Modal";
import CustomizeChat from "./CustomizeChat";

interface AddWebchatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWebchat: React.FC<AddWebchatProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <h2 className="text-lg font-semibold text-gray-800">
          Agregar o Editar Webchat
        </h2>
      }
    >
      <CustomizeChat onClose={onClose} />
    </Modal>
  );
};

export default AddWebchat;
