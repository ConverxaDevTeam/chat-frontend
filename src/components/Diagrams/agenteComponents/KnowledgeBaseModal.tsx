import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUpload, FaTrash, FaPlus } from "react-icons/fa";
import { KnowledgeBase } from "@interfaces/agents";
import { toast } from "react-toastify";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBaseByAgent,
} from "@services/knowledgeBase.service";

interface KnowledgeBaseModalProps {
  isShown: boolean;
  onClose: () => void;
  agentId: number;
}

interface FileListProps {
  files: KnowledgeBase[];
  onDelete: (fileId: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const FileList = ({
  files,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: FileListProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (files.length === 0) {
    return <div className="text-center py-4">No hay archivos cargados</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {files.map(file => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div>
              <p className="font-medium">{file.vectorStoreId}</p>
              <p className="text-sm text-gray-500">
                {file.expirationTime &&
                  new Date(file.expirationTime).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDelete(file.id!)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const UploadForm = ({
  onClose,
  agentId,
  onSuccess,
}: {
  onClose: () => void;
  agentId: number;
  onSuccess: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    console.log("Drop event triggered");
    console.log("Files in drop event:", e.dataTransfer.files);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      console.log("Dropped files:", droppedFiles);
      await handleFiles(droppedFiles);
    } else {
      console.log("No files were dropped");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      console.log("Selected files:", selectedFiles);
      await handleFiles(selectedFiles);
    } else {
      console.log("No files were selected");
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) {
      console.log("No files to process");
      return;
    }

    try {
      setIsUploading(true);
      console.log("Processing files:", files);

      let hasSuccess = false;
      let hasError = false;

      for (const file of files) {
        console.log(
          "Uploading file:",
          file.name,
          "Size:",
          file.size,
          "Type:",
          file.type
        );
        try {
          const response = await createKnowledgeBase(agentId, file);
          console.log("Upload response:", response);
          hasSuccess = true;
        } catch (error: unknown) {
          console.error(`Error uploading file ${file.name}:`, error);
          hasError = true;
          // Solo mostramos el mensaje de error si hay un mensaje específico
          if (
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object" &&
            "message" in error.response.data &&
            typeof error.response.data.message === "string"
          ) {
            toast.error(error.response.data.message);
          }
        }
      }
      // Solo mostramos mensajes después de procesar todos los archivos
      if (hasSuccess && !hasError) {
        toast.success("Archivos subidos exitosamente");
        onSuccess();
        onClose();
      } else if (!hasSuccess && hasError) {
        // Si no hubo éxitos y hubo errores, mostramos un mensaje general solo si no se mostró uno específico
        if (!toast.isActive("upload-error")) {
          toast.error("Error al subir los archivos", {
            toastId: "upload-error",
          });
        }
      }
      // Si hay éxitos y errores mezclados, los errores específicos ya se mostraron
    } catch (error) {
      console.error("Error general al subir archivos:", error);
      if (!toast.isActive("upload-error")) {
        toast.error("Error al subir los archivos", { toastId: "upload-error" });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        <FaUpload className="text-4xl text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">
          {isUploading
            ? "Subiendo archivos..."
            : "Arrastra y suelta archivos aquí o"}
        </p>
        <label
          className={`cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Seleccionar Archivos
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            accept=".txt,.pdf,.doc,.docx"
          />
        </label>
      </div>
    </div>
  );
};

export const KnowledgeBaseModal = ({
  isShown,
  onClose,
  agentId,
}: KnowledgeBaseModalProps) => {
  const [files, setFiles] = useState<KnowledgeBase[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await getKnowledgeBaseByAgent(agentId);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error al cargar los archivos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isShown) {
      fetchFiles();
    }
  }, [isShown, agentId]);

  const handleDelete = async (fileId: number) => {
    try {
      await deleteKnowledgeBase(fileId);
      toast.success("Archivo eliminado exitosamente");
      await fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error al eliminar el archivo");
    }
  };

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {showUploadForm ? "Subir Archivos" : "Base de Conocimientos"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        {showUploadForm ? (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex items-center justify-center px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                Volver al listado
              </button>
            </div>
            <UploadForm
              onClose={() => setShowUploadForm(false)}
              agentId={agentId}
              onSuccess={fetchFiles}
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center justify-center px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                <FaPlus className="mr-2" /> Agregar Archivos
              </button>
            </div>
            <FileList
              files={files.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )}
              onDelete={handleDelete}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};
