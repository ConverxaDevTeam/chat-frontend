import React from "react";

interface DepartmentConfirmationModalProps {
    isOpen: boolean;
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
}

const DepartmentConfirmationModal: React.FC<DepartmentConfirmationModalProps> = ({
    isOpen,
    title,
    text,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">
                <div className="flex justify-center mb-3">
                    <img src="/mvp/triangle-alert.svg" alt="Warning Icon" className="w-15 h-15 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
                <p className="text-center text-gray-600 mb-6">{text}</p>
                <div className="flex justify-between gap-4">
                    <button
                        onClick={onConfirm}
                        className="w-full font-semibold px-5 py-2 border border-gray-500 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300">
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full font-semibold px-5 py-2 bg-red-400 text-black rounded-lg hover:bg-red-600 transition duration-300">
                        {cancelText}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DepartmentConfirmationModal;
