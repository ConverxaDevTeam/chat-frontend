import React from "react";
import ReactDOM from "react-dom";

interface OperationModalProps {
  isShown: boolean;
  title: string;
  text: string;
  type: "loading" | "success" | "error";
  onClose?: () => void;
}

const OperationModal: React.FC<OperationModalProps> = ({
  isShown,
  title,
  text,
  type,
  onClose,
}) => {
  if (!isShown) return null;
  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  const imageMapping: Record<
    "success" | "error",
    { src: string; alt: string }
  > = {
    success: { src: "/mvp/circle-alert.svg", alt: "Check circle" },
    error: { src: "/mvp/triangle-alert.svg", alt: "Alert triangle" },
  };

  const imageData = type !== "loading" ? imageMapping[type] : null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
      style={{ zIndex: 999 }}
      onClick={e => {
        if (onClose && e.target === e.currentTarget && type !== "loading") {
          onClose();
        }
      }}
    >
      <div className="bg-white flex flex-col justify-center items-center rounded-[4px] p-6 w-[500px] shadow-lg text-center transform transition-all duration-300 ease-in-out animate-modal-open">
        {imageData && (
          <img
            src={imageData.src}
            alt={imageData.alt}
            className="w-[53px] h-[80px]"
          />
        )}
        {type === "loading" && (
          <div className="w-16 h-16 mb-4">
            <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-sofia-electricGreen animate-spin"></div>
          </div>
        )}
        <h2 className="text-xl gap-2 font-semibold text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-600 mb-6">{text}</p>
        {type !== "loading" && onClose && (
          <button
            onClick={onClose}
            className="w-full mx-auto px-5 py-2 border border-gray-500 rounded-[4px] text-gray-700 hover:bg-gray-100 transition duration-300"
            aria-label="Cerrar modal"
          >
            Ok
          </button>
        )}
      </div>
    </div>,
    modalRoot
  );
};

export default OperationModal;
