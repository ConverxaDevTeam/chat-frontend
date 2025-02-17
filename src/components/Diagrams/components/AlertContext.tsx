import React, { createContext, useContext } from "react";
import { useSweetAlert } from "@hooks/useSweetAlert";
import OperationModal from "@components/OperationModal";
import ConfirmationModal from "@components/ConfirmationModal";

interface AlertContextType {
    isOpen: boolean;
    modalOptions: {
        title: string;
        text: string;
        confirmButtonText?: string;
        cancelButtonText?: string;
    } | null;
    handleConfirm: () => void;
    handleCancel: () => void;
    isOperationModalOpen: boolean;
    operationModalOptions: {
        title: string;
        text: string;
        type: "loading" | "success" | "error";
        autoCloseDelay?: number;
    } | null;
    hideOperationModal: () => void;
    handleOperation: <T>(
        operation: () => Promise<T>,
        options: {
            title: string;
            successTitle: string;
            successText: string;
            errorTitle: string;
            loadingTitle?: string;
        }
    ) => Promise<{ success: boolean; data?: T; error?: unknown }>;
    showConfirmation: (options: {
        title: string;
        text: string;
        confirmButtonText?: string;
        cancelButtonText?: string;
        onConfirm?: () => Promise<boolean | void>;
    }) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const sweetAlert = useSweetAlert();
    return (
        <AlertContext.Provider value={sweetAlert}>
            {children}
            <OperationModal
                isShown={sweetAlert.isOperationModalOpen}
                title={sweetAlert.operationModalOptions?.title || ""}
                text={sweetAlert.operationModalOptions?.text || ""}
                type={sweetAlert.operationModalOptions?.type || "loading"}
                onClose={sweetAlert.hideOperationModal}
            />
            <ConfirmationModal
                isShown={sweetAlert.isOpen}
                title={sweetAlert.modalOptions?.title || ""}
                text={sweetAlert.modalOptions?.text || ""}
                confirmText={sweetAlert.modalOptions?.confirmButtonText || "Confirmar"}
                cancelText={sweetAlert.modalOptions?.cancelButtonText || "Cancelar"}
                onConfirm={sweetAlert.handleConfirm}
                onClose={sweetAlert.handleCancel}
            />
        </AlertContext.Provider>
    );
};

export const useAlertContext = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlertContext debe usarse dentro de AlertProvider");
    }
    return context;
};
