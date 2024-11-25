import ReactDOM from "react-dom";
import React from "react";

interface ModalProps {
  isShown: boolean;
  element: JSX.Element;
  close: (value: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ isShown, element, close }) => {
  const modal = document.getElementById("modal");
  if (!modal) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Evita cerrar el modal si se hace clic dentro del contenido del modal
    if (e.target === e.currentTarget) {
      close(false);
    }
  };

  return isShown
    ? ReactDOM.createPortal(
        <div
          className="fixed z-[100] w-full h-full flex justify-center items-center top-0 left-0 bg-[#212121] bg-opacity-75"
          onClick={handleBackgroundClick}
        >
          {element}
        </div>,
        modal
      )
    : null;
};

export default Modal;
