import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUpload, FaTrash, FaPlus } from "react-icons/fa";

interface KnowledgeBaseModalProps {
  isShown: boolean;
  onClose: () => void;
  agentId: number;
}

interface KnowledgeBaseFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface FileListProps {
  files: KnowledgeBaseFile[];
  onDelete: (fileId: string) => void;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const FileList = ({
  files,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: FileListProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {files.map(file => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {file.size} • {file.uploadDate}
              </p>
            </div>
            <button
              onClick={() => onDelete(file.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

const UploadForm = ({ onClose }: { onClose: () => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop here
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload here
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        <FaUpload className="text-4xl text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">Arrastra y suelta archivos aquí o</p>
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Seleccionar Archivos
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
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
  const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handleDelete = (fileId: string) => {
    // Handle file deletion here
    setFiles(files.filter(file => file.id !== fileId));
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
            <UploadForm onClose={() => setShowUploadForm(false)} />
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
            />
          </>
        )}
      </div>
    </div>
  );
};
