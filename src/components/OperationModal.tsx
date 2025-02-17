import React from "react";
import ReactDOM from "react-dom";

interface OperationModalProps {
    isShown: boolean;
    title: string;
    text: string;
    type: "loading" | "success" | "error";
    onClose?: () => void;
}

const OperationModal: React.FC<OperationModalProps> = ({ isShown, title, text, type, onClose }) => {
    if (!isShown) return null;
    const modalRoot = document.getElementById("modal");
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={(e) => {
                if (onClose && e.target === e.currentTarget && type !== "loading") {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{text}</p>
                {type !== "loading" && onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-sofia-electricGreen font-semibold text-gray-900 rounded-md"
                        aria-label="Cerrar modal"
                    >
                        Cerrar
                    </button>
                )}
                {type === "loading" && (
                    <div className="mt-4">Cargando...</div>
                )}
            </div>
        </div>,
        modalRoot
    );
};

export default OperationModal;
