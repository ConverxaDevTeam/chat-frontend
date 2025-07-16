import React from "react";
import ReactDOM from "react-dom";

interface ConfirmationModalProps {
  isShown: boolean;
  title: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  zIndex?: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isShown,
  title,
  text,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  zIndex = 999,
}) => {
  if (!isShown) return null;

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex }}
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-[4px] p-6 w-[500px] shadow-xl">
        <div className="flex justify-center mb-3">
          <img
            src="/mvp/triangle-alert.svg"
            alt="Warning Icon"
            className="w-15 h-15 text-red-500"
          />
        </div>
        <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
        <p className="text-center text-gray-600 mb-6">{text}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={async () => {
              try {
                if (onConfirm) {
                  const result = await onConfirm();
                  if (typeof result === "boolean" && result === false) {
                    return;
                  }
                }
                onClose();
              } catch (error) {
                console.error("Error in confirmation:", error);
                onClose();
              }
            }}
            className="w-full font-semibold px-5 py-2 border border-gray-500 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="w-full font-semibold px-5 py-2 bg-red-400 text-black rounded-lg hover:bg-red-600 transition duration-300"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default ConfirmationModal;
