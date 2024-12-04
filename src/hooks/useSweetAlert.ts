import Swal from "sweetalert2";

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

interface SweetAlertOptions {
  title: string;
  successTitle: string;
  successText: string;
  errorTitle: string;
  loadingTitle?: string;
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
  const showConfirmation = async (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || "Sí",
      cancelButtonText: options.cancelButtonText || "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    return result.isConfirmed;
  };

  const handleOperation = async <T>(
    operation: () => Promise<T>,
    options: SweetAlertOptions
  ): Promise<OperationResult<T>> => {
    let result: T;

    try {
      await Swal.fire({
        title: options.loadingTitle || options.title,
        html: "Tiempo restante: <b></b>",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            result = await operation();
            console.log("Operation result:", result);
            Swal.close();
            await Swal.fire({
              icon: "success",
              title: options.successTitle,
              text: options.successText,
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } catch (err) {
            console.error("Operation error:", err);
            const errorMessage = formatError(err);
            Swal.close();
            await Swal.fire({
              icon: "error",
              title: options.errorTitle,
              html: errorMessage.replace(/\\n/g, "<br>"),
              confirmButtonColor: "#d33",
            });
            throw err;
          }
        },
      });

      return { success: true, data: result! };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    showConfirmation,
    handleOperation,
  };
};
