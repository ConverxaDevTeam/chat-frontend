import React from "react";
import CustomizeChat from "./CustomizeChat";
import ModalWebChat from "./ModalWebChat";

interface AddWebchatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWebchat: React.FC<AddWebchatProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWebChat isShown={isOpen} onClose={onClose}>
      <CustomizeChat onClose={onClose} />
    </ModalWebChat>
  );
};

export default AddWebchat;
