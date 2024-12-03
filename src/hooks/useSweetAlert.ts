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

const formatErrorMessage = (error: unknown): string => {
  // Si es un error de axios, puede venir en error.response.data
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as ApiError;
    if (axiosError.response?.data?.message) {
      const message = axiosError.response.data.message;
      if (Array.isArray(message)) {
        return message.join("\\n");
      }
      return message;
    }
  }

  // Si es un error directo de la API
  if (error && typeof error === "object" && "message" in error) {
    const apiError = error as ApiError;
    if (apiError.message) {
      if (Array.isArray(apiError.message)) {
        return apiError.message.join("\\n");
      }
      return apiError.message;
    }
  }

  // Si es un error estándar de JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Si es un objeto, intentamos convertirlo a string
  if (error && typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return "Ha ocurrido un error desconocido";
    }
  }

  // Fallback para cualquier otro tipo de error
  return "Ha ocurrido un error";
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
            const errorMessage = formatErrorMessage(err);
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
