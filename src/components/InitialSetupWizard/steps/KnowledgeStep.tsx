import { useEffect, useState } from "react";
import { StepComponentProps } from "../types";
import { KnowledgeBase } from "@interfaces/agents";
import { toast } from "react-toastify";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBaseByAgent,
  ALLOWED_FILE_EXTENSIONS,
} from "@services/knowledgeBase.service";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { useRef } from "react";
import InfoTooltip from "@components/common/InfoTooltip";
import StepContainer from "../components/StepContainer";

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
      <div className="space-y-[24px]">
        {files.map(file => (
          <div
            key={file.id}
            className="flex items-center justify-between h-[48px] px-[16px] bg-[#FCFCFC] rounded-lg border border-[#DBEAF2]"
          >
            <div className="flex items-center gap-[8px]">
              <p className="font-medium">{file.filename}</p>
              <p className="text-sm text-[#A6A8AB]">
                {file.updated_at &&
                  new Date(file.updated_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDelete(file.id!)}
              className="text-red-500 hover:text-red-700"
            >
              <img src="/mvp/trash.svg" alt="Eliminar" className="w-5 h-5" />
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
  onSuccess,
  agentId,
}: {
  onSuccess: () => void;
  agentId: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { handleOperation } = useAlertContext();
  const dropRef = useRef<HTMLDivElement>(null);

  const acceptedFileTypes = ALLOWED_FILE_EXTENSIONS.map(ext => `.${ext}`).join(
    ","
  );

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach(file => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        fileExtension &&
        ALLOWED_FILE_EXTENSIONS.includes(
          fileExtension as (typeof ALLOWED_FILE_EXTENSIONS)[number]
        )
      ) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(
        `Los siguientes archivos no son permitidos: ${invalidFiles.join(", ")}`
      );
    }

    return validFiles;
  };

  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragIn = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragOut = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files: File[] = [];

      if (e.dataTransfer?.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const item = e.dataTransfer.items[i];
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) {
              files.push(file);
            }
          }
        }
      } else if (e.dataTransfer?.files) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const file = e.dataTransfer.files[i];
          files.push(file);
        }
      }

      if (files.length > 0) {
        const validFiles = validateFiles(files);
        if (validFiles.length > 0) {
          handleFiles(validFiles);
        }
      }
    };

    dropArea.addEventListener("dragenter", handleDragIn);
    dropArea.addEventListener("dragleave", handleDragOut);
    dropArea.addEventListener("dragover", handleDrag);
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      dropArea.removeEventListener("dragenter", handleDragIn);
      dropArea.removeEventListener("dragleave", handleDragOut);
      dropArea.removeEventListener("dragover", handleDrag);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(selectedFiles);
      if (validFiles.length > 0) {
        await handleFiles(validFiles);
      }
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const result = await handleOperation(
      async () => {
        let hasSuccess = false;
        let hasError = false;

        for (const file of files) {
          try {
            await createKnowledgeBase(agentId, file);
            hasSuccess = true;
          } catch (error) {
            hasError = true;
            throw error;
          }
        }

        if (hasSuccess) {
          onSuccess();
        }

        return { hasSuccess, hasError };
      },
      {
        title: "Subiendo archivos",
        loadingTitle: "Subiendo archivos",
        successTitle: "¡Éxito!",
        successText: "Archivos subidos correctamente",
        errorTitle: "Error al subir archivos",
      }
    );

    if (!result.success) {
      console.error("Error al subir archivos:", result.error);
    }
  };

  return (
    <div
      ref={dropRef}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <div className="flex flex-col items-center">
        <svg
          className="text-4xl text-gray-400 mb-2 w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-gray-600 mb-2">Arrastra y suelta archivos aquí o</p>
        <label className="cursor-pointer bg-[#F4FAFF] border border-[#DBEAF2] text-app-superDark px-4 py-2 rounded hover:bg-opacity-70">
          + Subir archivo
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
            accept={acceptedFileTypes}
          />
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Formatos permitidos: {ALLOWED_FILE_EXTENSIONS.join(", ")}
        </p>
      </div>
    </div>
  );
};

const KnowledgeStep: React.FC<StepComponentProps> = ({ agentId }) => {
  const [files, setFiles] = useState<KnowledgeBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const { handleOperation } = useAlertContext();

  const fetchFiles = async () => {
    if (!agentId) return;

    setIsLoading(true);
    try {
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
    if (agentId) {
      fetchFiles();
    }
  }, [agentId]);

  const handleDelete = async (fileId: number) => {
    const result = await handleOperation(
      async () => {
        const response = await deleteKnowledgeBase(fileId);
        if (response.status >= 200 && response.status < 300) {
          await fetchFiles();
          return true;
        }
        throw new Error(`Error al eliminar archivo: ${response.status}`);
      },
      {
        title: "Eliminando archivo",
        loadingTitle: "Eliminando archivo",
        successTitle: "¡Éxito!",
        successText: "Archivo eliminado correctamente",
        errorTitle: "Error al eliminar archivo",
      }
    );

    if (!result.success) {
      console.error("Error al eliminar archivo:", result.error);
    }
  };

  return (
    <StepContainer
      title="Base de conocimiento"
      subtitle="Agrega respuestas clave que el asistente usará para responder con precisión."
    >
      <div className="space-y-6">
        {showUploadForm ? (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex items-center justify-center px-4 py-2 text-sm text-app-superDark bg-[#F4FAFF] border border-[#DBEAF2] rounded-[4px] hover:bg-opacity-70 transition-colors duration-200"
              >
                Volver al listado
              </button>
            </div>
            <UploadForm
              agentId={agentId!}
              onSuccess={() => {
                fetchFiles();
                setShowUploadForm(false);
              }}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 mb-4">
              <p className="text-app-superDark text-[16px] font-normal flex items-center gap-2">
                Base de conocimientos
                <InfoTooltip
                  text="Añade archivos con información que el agente utilizará para responder preguntas. Puedes subir guías, documentos de soporte u otros recursos relevantes."
                  width="237px"
                />
              </p>
              <p className="text-app-navyBlue text-[12px]">
                Añade archivos con información que el agente utilizará para
                responder preguntas. Puedes subir guías, documentos de soporte u
                otros recursos relevantes
              </p>
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
            <div>
              <button
                onClick={() => setShowUploadForm(true)}
                className="w-full h-[48px] mt-[9px] flex items-center justify-center px-4 py-2 text-sm text-app-superDark border-[#DBEAF2] border-[1px] bg-[#F4FAFF] rounded-[4px] hover:bg-opacity-70 transition-colors duration-200"
              >
                <img
                  src="/mvp/plus.svg"
                  className="inline-block w-5 h-5 mr-2"
                />{" "}
                Subir archivo
              </button>
            </div>
          </>
        )}
      </div>
    </StepContainer>
  );
};

export default KnowledgeStep;
