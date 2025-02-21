import ReactDOM from "react-dom";
import React, { Fragment } from "react";

interface ModalProps {
  isShown: boolean;
  children: JSX.Element;
  onClose: () => void;
  header?: JSX.Element;
  footer?: JSX.Element;
  modalRef?: React.RefObject<HTMLDivElement>;
}

const ModalHeader: React.FC<{
  children: React.ReactNode;
  handleClose: () => void;
}> = ({ children, handleClose }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="text-xl font-bold">{children}</div>
    <button
      onClick={handleClose}
      className="absolute top-7 right-7 text-gray-900 hover:text-gray-600 font-semibold"
      aria-label="Cerrar modal"
    >
      ✕
    </button>
  </div>
);

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
          ref={modalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white rounded-xl p-6 w-auto max-w-full relative">
            {header && (
              <Fragment>
                <ModalHeader handleClose={onClose}>{header}</ModalHeader>
                <hr className="border-t border-gray-300 mb-4" />
              </Fragment>
            )}
            <div className="w-full space-y-4 mt-7 flex flex-col">
              {children}
            </div>
            {footer && <footer className="mt-4">{footer}</footer>}
          </div>
        </div>,
        modal
      )
    : null;
};

export default Modal;
