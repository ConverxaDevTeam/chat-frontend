import Modal from "@components/Modal";
import { MdCheckCircle, MdError, MdWarning } from "react-icons/md";
import Swal from "sweetalert2";

interface TestResponseModalProps {
  isShown: boolean;
  onClose: () => void;
  response: {
    status: number;
    data: unknown;
  };
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getStatusInfo = (status: number) => {
  if (status >= 200 && status < 300) {
    return {
      icon: <MdCheckCircle className="w-8 h-8 text-green-500" />,
      title: "Éxito",
      className: "text-green-500",
    };
  }
  if (status >= 300 && status < 400) {
    return {
      icon: <MdWarning className="w-8 h-8 text-yellow-500" />,
      title: "Redirección",
      className: "text-yellow-500",
    };
  }
  if (status === 400) {
    return {
      icon: <MdError className="w-8 h-8 text-red-500" />,
      title: "Error de Validación",
      className: "text-red-500",
    };
  }
  return {
    icon: <MdError className="w-8 h-8 text-red-500" />,
    title: "Error",
    className: "text-red-500",
  };
};

const showFullResponse = (data: unknown) => {
  Swal.fire({
    title: "Respuesta Completa",
    html: `<pre class="text-left overflow-auto max-h-[70vh] whitespace-pre-wrap" style="max-width: 800px">${JSON.stringify(
      data,
      null,
      2
    )}</pre>`,
    width: 900,
    confirmButtonText: "Cerrar",
  });
};

export const TestResponseModal = ({
  isShown,
  onClose,
  response,
}: TestResponseModalProps) => {
  const { icon, title, className } = getStatusInfo(response.status);

  let displayData = response.data;

  if (response.status >= 400) {
    if (isPlainObject(response.data) && Object.keys(response.data).length > 0) {
      const errorData = response.data as any;
      displayData = {
        message:
          errorData.error?.message ||
          errorData.message ||
          "Error desconocido",
        complete:
          errorData.error?.complete ||
          errorData.complete ||
          `Error ${response.status}: No se pudo completar la operación`,
      };
    } else {
      displayData = {
        message: "Error en el servidor",
        complete: `Error ${response.status}: No se pudo completar la operación`,  
      };
    }
  }

  const responseStr = JSON.stringify(displayData, null, 2);
  const truncatedResponse = responseStr.split("\n").slice(0, 15).join("\n");
  const hasMore = responseStr.split("\n").length > 15;

  return (
    <Modal
      isShown={isShown}
      onClose={onClose}
      header={
        <div className="flex items-center gap-2">
          {icon}
          <h2 className={`text-xl font-semibold ${className}`}>{title}</h2>
          <span className="text-gray-500">({response.status})</span>
        </div>
      }
    >
      <div className="space-y-4">
        <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-60 text-sm">
          {truncatedResponse}
        </pre>
        {hasMore && (
          <div className="flex justify-end">
            <button
              onClick={() => showFullResponse(displayData)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver respuesta completa
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
