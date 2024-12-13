import ReactDOM from "react-dom";
import React from "react";

interface RawModalProps {
  isShown: boolean;
  children: React.ReactNode;
  onClose: () => void;
}
const RawModal: React.FC<RawModalProps> = ({ isShown, children, onClose }) => {
  const modal = document.getElementById("modal");
  if (!modal) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Evita cerrar el modal si se hace clic dentro del contenido del modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return isShown
    ? ReactDOM.createPortal(
        <div
          className="fixed z-[100] w-full h-full flex justify-center items-center top-0 left-0 bg-[#212121] bg-opacity-75"
          onClick={handleBackgroundClick}
        >
          {children}
        </div>,
        modal
      )
    : null;
};

export default RawModal;
