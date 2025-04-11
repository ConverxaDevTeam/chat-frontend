import React, { useState } from "react";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import { Button } from "@components/common/Button";
import Loading from "@components/Loading";
import { Input } from "@components/forms/input";
import {
  generateTemplateWithAI,
  continueTemplateGenerationWithAI,
} from "@services/template.service";

// Modal para generar templates con IA
export const AIGeneratorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTemplateGenerated?: () => Promise<void>;
}> = ({ isOpen, onClose, onTemplateGenerated }) => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<
    FunctionTemplate[]
  >([]);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [totalLines, setTotalLines] = useState(0);
  const [progress, setProgress] = useState(0);

  // El total de líneas se obtiene del servicio en la primera llamada

  const updateUIWithTemplate = (template: FunctionTemplate) => {
    const lastLine = template.lastProcessedLine || 0;

    // Calcular progreso
    if (totalLines > 0 && lastLine > 0) {
      const currentProgress = Math.min(
        Math.round((lastLine / totalLines) * 100),
        100
      );
      setProgress(currentProgress);
      setProcessingStatus(
        `Procesando... ${currentProgress}% completado (línea ${lastLine} de ${totalLines})`
      );
    }

    // Agregar el template generado a la lista si no existe
    setGeneratedTemplates(prev => {
      // Evitar duplicados
      if (!prev.some(t => t.id === template.id)) {
        return [...prev, template];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("El contenido es requerido");
      return;
    }

    try {
      // Inicializar estados
      setIsLoading(true);
      setIsGenerating(true);
      setGeneratedTemplates([]);
      setProgress(0);
      setProcessingStatus("Iniciando generación de templates...");

      // Generar template inicial
      let currentTemplate = await generateWithAI(content, message, domain);

      // Actualizar UI con el template generado
      updateUIWithTemplate(currentTemplate);

      // Procesar la generación completa de templates
      let isCompleted = false;

      while (!isCompleted && currentTemplate) {
        // Verificar si ya se procesó todo el contenido
        const lastLine = currentTemplate.lastProcessedLine || 0;
        if (lastLine >= totalLines) {
          isCompleted = true;
          setIsGenerating(false);
          setProcessingStatus("Generación completada");
          break;
        }

        // Continuar con la generación
        setIsLoading(true);
        const updatedTemplate = await continueTemplateGenerationWithAI(
          content,
          message,
          currentTemplate.lastProcessedLine,
          currentTemplate.id,
          currentTemplate.categoryId,
          currentTemplate.applicationId,
          domain,
          {
            applicationId: currentTemplate.application?.id?.toString(),
          }
        );

        // Actualizar el template actual y la UI
        currentTemplate = updatedTemplate;
        updateUIWithTemplate(updatedTemplate);
      }
    } catch (error) {
      console.error("Error al generar template:", error);
      setIsGenerating(false);
      setProcessingStatus("Error al generar template");
    } finally {
      setIsLoading(false);
    }
  };

  const generateWithAI = async (
    content: string,
    message: string,
    domain?: string
  ): Promise<FunctionTemplate> => {
    try {
      const data = await generateTemplateWithAI(content, message, domain);
      // Actualizar el total de líneas con el valor que viene del servicio
      setTotalLines(data.data.totalLines);
      return data.data.template;
    } catch (error) {
      console.error("Error al generar el template con IA:", error);
      toast.error("Error al generar el template con IA");
      throw error;
    }
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    setProcessingStatus("Generación detenida por el usuario");
    toast.info("Generación detenida");
  };

  const handleClose = () => {
    setContent("");
    setMessage("");
    setDomain("");
    setGeneratedTemplates([]);
    setIsGenerating(false);
    setProcessingStatus("");
    setProgress(0);
    setTotalLines(0);
    if (onTemplateGenerated) onTemplateGenerated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <img src="/mvp/bot.svg" alt="IA" className="w-5 h-5" />
          Generar Template con IA
        </h2>
        {!isGenerating ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido *
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Ingresa el contenido para generar un template"
                required
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa el contenido HTML o texto para generar un template
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dominio
              </label>
              <Input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="ejemplo.com"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Dominio para las imágenes del template
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje adicional
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Instrucciones adicionales para la IA..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="default"
                onClick={handleClose}
                type="button"
                className="!h-auto py-1.5 px-3"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="!h-auto py-1.5 px-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loading /> Generando...
                  </span>
                ) : (
                  "Generar"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4 border-b pb-2">
              <h3 className="font-medium text-gray-800">
                Estado de generación
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {processingStatus || "Procesando..."}
              </p>
              <div className="mt-2">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {generatedTemplates.length > 0 && (
              <div className="mb-4 max-h-60 overflow-y-auto">
                <h3 className="font-medium text-gray-800 mb-2">
                  Templates generados ({generatedTemplates.length})
                </h3>
                {generatedTemplates.map((template, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="default"
                onClick={handleClose}
                type="button"
                className="!h-auto py-1.5 px-3"
              >
                Cerrar
              </Button>
              <Button
                variant="cancel"
                onClick={handleStopGeneration}
                type="button"
                className="!h-auto py-1.5 px-3"
                disabled={!isLoading}
              >
                Detener generación
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook para usar el generador de IA
export const useAITemplateGenerator = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleOpenAIModal = () => {
    setIsAIModalOpen(true);
  };

  const handleCloseAIModal = () => {
    setIsAIModalOpen(false);
  };

  return {
    isAIModalOpen,
    handleOpenAIModal,
    handleCloseAIModal,
  };
};

export default AIGeneratorModal;
