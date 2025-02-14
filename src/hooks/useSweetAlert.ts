import { useState } from "react";

interface ApiError {
  ok: boolean;
  message?: string | string[];
  statusCode?: number;
  error?: string;
  path?: string;
  response?: {
    data?: {
      message?: string | string[];
      error?: string;
    };
  };
}

interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: unknown;
}

const formatAxiosError = (error: ApiError): string | null => {
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    if (Array.isArray(message)) {
      return message.join("\\n");
    }
    return message;
  }
  return null;
};

const formatApiError = (error: ApiError): string | null => {
  if (error.message) {
    if (Array.isArray(error.message)) {
      return error.message.join("\\n");
    }
    return error.message;
  }
  return null;
};

const formatGenericError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return "Ha ocurrido un error desconocido";
    }
  }

  return "Ha ocurrido un error";
};

const formatError = (error: unknown): string => {
  if (!error || typeof error !== "object") {
    return formatGenericError(error);
  }

  // Intenta formatear como error de Axios
  if ("response" in error) {
    const axiosErrorMessage = formatAxiosError(error as ApiError);
    if (axiosErrorMessage) return axiosErrorMessage;
  }

  // Intenta formatear como error de API
  if ("message" in error) {
    const apiErrorMessage = formatApiError(error as ApiError);
    if (apiErrorMessage) return apiErrorMessage;
  }

  // Fallback a error genérico
  return formatGenericError(error);
};

export const useSweetAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<{
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    resolve: (value: boolean) => void;
    onConfirm?: () => Promise<boolean | void>;
  } | null>(null);

  const showConfirmation = async (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onConfirm?: () => Promise<boolean | void>;
  }): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setModalOptions({ ...options, resolve });
      setIsOpen(true);
    });
  };

  const handleConfirm = async () => {
    if (modalOptions) {
      try {
        if (modalOptions.onConfirm) {
          const result = await modalOptions.onConfirm();
          if (typeof result === 'boolean' && result === false) {
            modalOptions.resolve(false);
            return;
          }
        }
        modalOptions.resolve(true);
        setIsOpen(false);
        setModalOptions(null);
      } catch (error) {
        console.error('Error in confirmation:', error);
        modalOptions.resolve(false);
        setIsOpen(false);
        setModalOptions(null);
      }
    }
  };

  const handleCancel = () => {
    if (modalOptions?.resolve) {
      modalOptions.resolve(false);
    }
    setIsOpen(false);
    setModalOptions(null);
  };

  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [operationModalOptions, setOperationModalOptions] = useState<{
    title: string;
    text: string;
    type: "loading" | "success" | "error";
    autoCloseDelay?: number;
  } | null>(null);

  const showOperationModal = (options: {
    title: string;
    text: string;
    type: "loading" | "success" | "error";
    autoCloseDelay?: number;
  }): Promise<void> => {
    return new Promise<void>((resolve) => {
      setOperationModalOptions(options);
      setIsOperationModalOpen(true);

      if (options.type !== "loading" && options.autoCloseDelay) {
        setTimeout(() => {
          hideOperationModal();
          resolve();
        }, options.autoCloseDelay);
      } else if (options.type === "loading") {
        resolve();
      }
    });
  };

  const hideOperationModal = () => {
    setIsOperationModalOpen(false);
    setOperationModalOptions(null);
  };

  const handleOperation = async <T>(
    operation: () => Promise<T>,
    options: {
      title: string;
      successTitle: string;
      successText: string;
      errorTitle: string;
      loadingTitle?: string;
    }
  ): Promise<OperationResult<T>> => {
    let result: T;

    try {
      await showOperationModal({
        title: options.loadingTitle || options.title,
        text: "Espere un momento",
        type: "loading",
      });

      result = await operation();

      hideOperationModal();
      await new Promise<void>((resolve) => {
        showOperationModal({
          title: options.successTitle,
          text: options.successText,
          type: "success",
          autoCloseDelay: 1500,
        }).then(() => {
          resolve();
        });
      });

      return { success: true, data: result };
    } catch (error) {
      hideOperationModal();

      const errorMessage = formatError(error);
      
      await new Promise<void>((resolve) => {
        showOperationModal({
          title: options.errorTitle,
          text: errorMessage,
          type: "error",
          autoCloseDelay: 3000,
        }).then(() => {
          resolve();
        });
      });

      return { success: false, error };
    }
  };

  return {
    handleOperation,
    showConfirmation,
    isOpen,
    modalOptions,
    handleConfirm,
    handleCancel,
    isOperationModalOpen,
    operationModalOptions,
    hideOperationModal,
  };
};
