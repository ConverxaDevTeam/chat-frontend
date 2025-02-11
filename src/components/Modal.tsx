import ReactDOM from "react-dom";
import React from "react";

const ModalHeader: React.FC<{
  children: React.ReactNode;
  handleClose: () => void;
}> = ({ children, handleClose }) => (
  <header className="flex justify-between items-center p-5 self-stretch rounded-t-2xl border-b border-sofia-darkBlue bg-white">
    <span className="text-sofia-superDark text-2xl font-bold leading-6">
      {children}
    </span>
    <button
      onClick={() => handleClose()}
      className="text-sofia-superDark hover:opacity-80"
      aria-label="Cerrar modal"
    >
      <img src="/mvp/XIcon.svg" alt="Cerrar" className="w-6 h-6" />
    </button>
  </header>
);

interface ModalProps {
  isShown: boolean;
  children: JSX.Element;
  onClose: () => void;
  header?: JSX.Element;
  footer?: JSX.Element;
  modalRef?: React.RefObject<HTMLDivElement>;
}

const Modal: React.FC<ModalProps> = ({
  isShown,
  children,
  onClose,
  header,
  footer,
  modalRef,
}) => {
  const modal = document.getElementById("modal");
  if (!modal) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return isShown
    ? ReactDOM.createPortal(
        <div
          ref={modalRef} // Ref agregado aquí
          className="fixed z-[50] w-full h-full flex justify-center items-center top-0 left-0 bg-[#212121] bg-opacity-75"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-start border-3 border-sofia-darkBlue overflow-hidden">
            {header && (
              <ModalHeader handleClose={onClose}>{header}</ModalHeader>
            )}
            <div className="w-full p-[24px]">{children}</div>
            {footer && <footer className="mt-4">{footer}</footer>}
          </div>
        </div>,
        modal
      )
    : null;
};

export default Modal;
