import React from "react";
import CustomizeChat from "./CustomizeChat";
import RawModal from "@components/RawModal";

interface AddWebchatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWebchat: React.FC<AddWebchatProps> = ({ isOpen, onClose }) => {
  return (
    <RawModal isShown={isOpen} onClose={onClose}>
      <CustomizeChat onClose={onClose} />
    </RawModal>
  );
};

export default AddWebchat;
