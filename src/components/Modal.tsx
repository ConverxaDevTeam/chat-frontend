import ReactDOM from "react-dom";
import React from "react";

const ModalHeader: React.FC<{
  children: React.ReactNode;
  handleClose: () => void;
}> = ({ children, handleClose }) => (
  <header className="flex justify-between items-center">
    {children}
    <button
      onClick={() => handleClose()}
      className="text-gray-500 hover:text-gray-700"
    >
      &times;
    </button>
  </header>
);

interface ModalProps {
  isShown: boolean;
  children: JSX.Element;
  onClose: () => void;
  header?: JSX.Element;
  footer?: JSX.Element;
}

const Modal: React.FC<ModalProps> = ({
  isShown,
  children,
  onClose,
  header,
  footer,
}) => {
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 space-y-6 overflow-hidden">
            {header && (
              <ModalHeader handleClose={onClose}>{header}</ModalHeader>
            )}
            {children}
            {/* Footer section */}
            {footer && <footer className="mt-4">{footer}</footer>}
          </div>
        </div>,
        modal
      )
    : null;
};

export default Modal;
