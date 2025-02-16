import { useEffect, useState } from "react";
import { FaUpload, FaTrash, FaPlus } from "react-icons/fa";
import { KnowledgeBase } from "@interfaces/agents";
import { toast } from "react-toastify";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBaseByAgent,
  ALLOWED_FILE_EXTENSIONS,
} from "@services/knowledgeBase.service";
import { useSweetAlert } from "@hooks/useSweetAlert";
import Modal from "@components/Modal";
import { useRef } from "react";
import GuideConfig from "@components/GuideConfig";

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
  const { handleOperation } = useSweetAlert();
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
        // Usar DataTransferItemList
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
        // Fallback a DataTransfer
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
      } else {
        console.log("No se encontraron archivos en el evento drop");
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
          onClose();
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
        <FaUpload className="text-4xl text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">Arrastra y suelta archivos aquí o</p>
        <label className="cursor-pointer bg-[#D0FBF8] text-sofia-superDark px-4 py-2 rounded hover:bg-opacity-70">
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

const KnowledgeBaseModal = ({
  isShown,
  onClose,
  agentId,
}: KnowledgeBaseModalProps) => {
  const [files, setFiles] = useState<KnowledgeBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const { handleOperation } = useSweetAlert();

  const fetchFiles = async () => {
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
    if (isShown) {
      fetchFiles();
    }
  }, [isShown, agentId]);

  const handleDelete = async (fileId: number) => {
    const result = await handleOperation(
      async () => {
        await deleteKnowledgeBase(fileId);
        await fetchFiles();
        return true;
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
    <Modal isShown={isShown} onClose={onClose}>
      <div className="flex gap-[24px] w-[587px]">
        <GuideConfig />
        <div className="flex-1 flex flex-col gap-[16px]">
          {showUploadForm ? (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm text-sofia-superDark bg-[#D0FBF8] rounded-lg hover:bg-opacity-70 transition-colors duration-200"
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
              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="w-full text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
                  <p>
                    ⚠️ Los archivos que no se utilicen en una conversación se
                    eliminarán automáticamente después de 7 días.
                  </p>
                </div>
                <p className="text-sofia-superDark text-[14px] font-bold">
                  Base de conocimientos
                </p>
                <p className="text-sofia-navyBlue text-[10px]">
                  Añade archivos con información que el agente utilizará para
                  responder preguntas. Puedes subir guías, documentos de soporte
                  u otros recursos relevantes
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm text-sofia-superDark bg-[#D0FBF8] rounded-lg hover:bg-opacity-70 transition-colors duration-200"
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
              <div className="flex gap-[16px] mt-auto justify-end">
                <button
                  type="button"
                  className="w-[115px] h-[48px] text-sofia-navyBlue border-sofia-navyBlue border-[1px] font-semibold rounded-[8px]"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default KnowledgeBaseModal;
