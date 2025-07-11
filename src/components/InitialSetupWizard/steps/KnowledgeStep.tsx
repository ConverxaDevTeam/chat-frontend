import React, { useState } from "react";
import { StepComponentProps } from "../types";
import { ALLOWED_FILE_EXTENSIONS } from "@services/knowledgeBase.service";

const KnowledgeStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_FILE_EXTENSIONS.includes(extension as any)) {
      setError(
        `Formato no permitido: ${extension}. Formatos permitidos: ${ALLOWED_FILE_EXTENSIONS.join(", ")}`
      );
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(`El archivo ${file.name} es muy grande. Tamaño máximo: 10MB`);
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(validateFile);

    if (validFiles.length > 0) {
      updateData("knowledge", {
        files: [...data.knowledge.files, ...validFiles],
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateFile);

    if (validFiles.length > 0) {
      updateData("knowledge", {
        files: [...data.knowledge.files, ...validFiles],
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = data.knowledge.files.filter((_, i) => i !== index);
    updateData("knowledge", { files: newFiles });
  };

  const handleUrlAdd = () => {
    const urlInput = document.getElementById("url-input") as HTMLInputElement;
    const url = urlInput.value.trim();

    if (url && isValidUrl(url)) {
      updateData("knowledge", {
        urls: [...data.knowledge.urls, url],
      });
      urlInput.value = "";
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = data.knowledge.urls.filter((_, i) => i !== index);
    updateData("knowledge", { urls: newUrls });
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Base de conocimiento
        </h3>
        <p className="text-sm text-gray-600">
          Proporciona información para que tu agente pueda responder preguntas
        </p>
      </div>

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cargar archivos
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-sofia-electricGreen bg-green-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept={ALLOWED_FILE_EXTENSIONS.join(",")}
          />
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="font-medium text-sofia-electricGreen hover:text-sofia-superDark"
            >
              Haz clic para cargar
            </button>{" "}
            o arrastra archivos aquí
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Formatos: {ALLOWED_FILE_EXTENSIONS.join(", ")} (máx. 10MB)
          </p>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Files List */}
      {data.knowledge.files.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Archivos cargados:
          </p>
          <ul className="space-y-2">
            {data.knowledge.files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* URL Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Agregar URLs (opcional)
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            id="url-input"
            placeholder="https://ejemplo.com/documentacion"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sofia-electricGreen focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            className="px-4 py-2 bg-sofia-electricGreen text-white rounded-md hover:bg-opacity-90"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* URLs List */}
      {data.knowledge.urls.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            URLs agregadas:
          </p>
          <ul className="space-y-2">
            {data.knowledge.urls.map((url, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm text-gray-700 truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Este paso es opcional. Puedes agregar información más tarde desde
              el panel de administración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeStep;
