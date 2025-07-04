import React, { useState, useRef, useReducer, useCallback } from "react";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import { Button } from "@components/common/Button";
import Loading from "@components/Loading";
import { Input } from "@components/forms/input";
import {
  generateTemplateWithAI,
  continueTemplateGenerationWithAI,
} from "@services/template.service";

// Tipos para el estado y acciones del reducer
type GeneratorState = {
  content: string;
  message: string;
  domain: string;
  isLoading: boolean;
  isGenerating: boolean;
  isPaused: boolean;
  generatedTemplates: FunctionTemplate[];
  processingStatus: string;
  totalLines: number;
  progress: number;
  currentTemplate?: FunctionTemplate;
};

type GeneratorAction =
  | { type: "SET_FIELD"; field: keyof GeneratorState; value: unknown }
  | { type: "RESET" }
  | { type: "START_GENERATION" }
  | { type: "PAUSE_GENERATION" }
  | { type: "COMPLETE_GENERATION" }
  | { type: "ADD_TEMPLATE"; template: FunctionTemplate }
  | { type: "SET_PROGRESS"; lastLine: number; totalLines: number }
  | { type: "SET_ERROR"; message: string };

// Reducer para manejar el estado del generador
const generatorReducer = (
  state: GeneratorState,
  action: GeneratorAction
): GeneratorState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    case "START_GENERATION":
      return {
        ...state,
        isLoading: true,
        isGenerating: true,
        isPaused: false,
        generatedTemplates: [],
        progress: 0,
        totalLines: 0, // Reiniciar totalLines al iniciar una nueva generación
        processingStatus: "Iniciando generación de templates...",
      };
    case "PAUSE_GENERATION":
      return {
        ...state,
        isLoading: false,
        isPaused: true,
        processingStatus: "Pausando generación...",
      };
    case "COMPLETE_GENERATION":
      return {
        ...state,
        isLoading: false,
        isGenerating: false,
        processingStatus: "Generación completada",
      };
    case "ADD_TEMPLATE":
      // Evitar duplicados
      if (!state.generatedTemplates.some(t => t.id === action.template.id)) {
        return {
          ...state,
          generatedTemplates: [...state.generatedTemplates, action.template],
          currentTemplate: action.template,
        };
      }
      return { ...state, currentTemplate: action.template };
    case "SET_PROGRESS": {
      const currentProgress = Math.min(
        Math.round((action.lastLine / action.totalLines) * 100),
        100
      );
      return {
        ...state,
        progress: currentProgress,
        totalLines: action.totalLines,
        processingStatus: `Procesando... ${currentProgress}% completado (línea ${action.lastLine} de ${action.totalLines})`,
      };
    }
    case "SET_ERROR":
      return {
        ...state,
        isLoading: false,
        isGenerating: false,
        processingStatus: `Error: ${action.message}`,
      };
    default:
      return state;
  }
};

const initialState: GeneratorState = {
  content: "",
  message: "",
  domain: "",
  isLoading: false,
  isGenerating: false,
  isPaused: false,
  generatedTemplates: [],
  processingStatus: "",
  totalLines: 0,
  progress: 0,
};

// Hook personalizado para la generación de templates
const useTemplateGenerator = () => {
  const [state, dispatch] = useReducer(generatorReducer, initialState);
  const pauseGenerationRef = useRef(false);

  const updateUIWithTemplate = useCallback(
    (
      template: FunctionTemplate,
      lastProcessedLine = 0,
      totalLines?: number
    ) => {
      // Usar totalLines pasado como parámetro o el del estado
      const linesToUse = totalLines || state.totalLines;

      // Actualizar progreso si hay líneas totales
      if (linesToUse > 0 && lastProcessedLine > 0) {
        dispatch({
          type: "SET_PROGRESS",
          lastLine: lastProcessedLine,
          totalLines: linesToUse,
        });
      }

      // Agregar template a la lista
      dispatch({ type: "ADD_TEMPLATE", template });
    },
    [state.totalLines]
  );

  const generateWithAI = useCallback(
    async (
      content: string,
      message: string,
      domain?: string
    ): Promise<{
      template: FunctionTemplate | null;
      lastProcessedLine: number;
      totalLines: number;
      createdIds?: {
        applicationId?: string;
        categoryIds?: string[];
      };
    }> => {
      try {
        const data = await generateTemplateWithAI(content, message, domain);

        // Validar la estructura de la respuesta
        if (!data || !data.data) {
          console.error("[ERROR] Respuesta inválida del API, no contiene data");
          return { template: null, lastProcessedLine: 0, totalLines: 0 };
        }

        // Siempre actualizar totalLines con el valor más reciente de la API
        if (data.data.totalLines > 0) {
          dispatch({
            type: "SET_FIELD",
            field: "totalLines",
            value: data.data.totalLines,
          });
        }

        // Extraer lastProcessedLine de la respuesta
        const lastProcessedLine = data.data.lastProcessedLine || 0;
        // Process the last line received

        // Si no hay templates o el array está vacío, manejarlo adecuadamente
        if (!data.data.templates || data.data.templates.length === 0) {
          console.error(
            "[ERROR] Templates no recibidos en la respuesta del API"
          );
          toast.error(
            "Error al generar el template: No se recibieron templates"
          );
          return {
            template: null,
            lastProcessedLine,
            totalLines: data.data.totalLines || 0,
            createdIds: data.data.createdIds,
          };
        }

        // Tomamos el primer template del array
        const firstTemplate = data.data.templates[0];

        return {
          template: firstTemplate,
          lastProcessedLine,
          totalLines: data.data.totalLines,
          createdIds: data.data.createdIds,
        };
      } catch (error) {
        console.error("Error al generar el template con IA:", error);
        toast.error("Error al generar el template con IA");
        throw error;
      }
    },
    []
  );

  const handlePause = useCallback(() => {
    pauseGenerationRef.current = true;
    dispatch({ type: "PAUSE_GENERATION" });
    toast.info("Pausando generación");
  }, []);

  const handleReset = useCallback(() => {
    pauseGenerationRef.current = true;
    dispatch({ type: "RESET" });
  }, []);

  // Función para continuar la generación después de la primera llamada
  const continuarGeneracion = async (
    initialTemplate: FunctionTemplate,
    initialLastProcessedLine = 0,
    applicationId: string
  ) => {
    try {
      // Validar que el template existe
      if (!initialTemplate || !initialTemplate.id) {
        console.error(
          "[ERROR] Template inválido en continuarGeneracion",
          initialTemplate
        );
        return;
      }

      // Procesar la generación completa de templates
      let isCompleted = false;
      let currentTemplate = initialTemplate;
      let lastProcessedLine = initialLastProcessedLine;

      while (!isCompleted && currentTemplate && !pauseGenerationRef.current) {
        // Verificar si ya se procesó todo el contenido
        if (lastProcessedLine >= state.totalLines && state.totalLines > 0) {
          isCompleted = true;
          dispatch({ type: "COMPLETE_GENERATION" });

          break;
        }

        // Continuar con la generación
        dispatch({ type: "SET_FIELD", field: "isLoading", value: true });

        const result = await continueTemplateGenerationWithAI(
          state.content,
          state.message,
          lastProcessedLine,
          currentTemplate.id,
          currentTemplate.categoryId,
          currentTemplate.applicationId,
          state.domain,
          {
            applicationId,
          }
        );

        // Verificar que hay templates en la respuesta
        if (!result.data.templates || result.data.templates.length === 0) {
          console.error(
            "[ERROR] No se recibieron templates en la continuación"
          );
          toast.error(
            "Error al continuar la generación: No se recibieron templates"
          );
          break;
        }

        const updatedTemplate = result.data.templates[0];
        lastProcessedLine = result.data.lastProcessedLine;

        // Actualizar totalLines si está disponible
        if (result.data.totalLines && result.data.totalLines > 0) {
          dispatch({
            type: "SET_FIELD",
            field: "totalLines",
            value: result.data.totalLines,
          });
        }

        // Si se pausó durante la petición, detener el ciclo
        if (pauseGenerationRef.current) {
          dispatch({
            type: "SET_FIELD",
            field: "processingStatus",
            value: "Generación pausada en línea " + lastProcessedLine,
          });
          currentTemplate = updatedTemplate;
          updateUIWithTemplate(
            updatedTemplate,
            lastProcessedLine,
            result.data.totalLines
          );
          break;
        }

        // Actualizar el template actual y la UI
        currentTemplate = updatedTemplate;
        updateUIWithTemplate(
          updatedTemplate,
          lastProcessedLine,
          result.data.totalLines
        );
      }
    } catch (error) {
      console.error("Error al continuar la generación:", error);
      dispatch({
        type: "SET_ERROR",
        message: "Error al continuar la generación",
      });
    } finally {
      dispatch({ type: "SET_FIELD", field: "isLoading", value: false });
    }
  };

  return {
    state,
    dispatch,
    pauseGenerationRef,
    updateUIWithTemplate,
    generateWithAI,
    continuarGeneracion,
    handlePause,
    handleReset,
  };
};

// Modal para generar templates con IA
export const AIGeneratorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTemplateGenerated?: () => Promise<void>;
}> = ({ isOpen, onClose, onTemplateGenerated }) => {
  const {
    state,
    dispatch,
    pauseGenerationRef,
    updateUIWithTemplate,
    generateWithAI,
    continuarGeneracion,
    handlePause,
    handleReset,
  } = useTemplateGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.content.trim()) {
      toast.error("El contenido es requerido");
      return;
    }

    try {
      // Inicializar estados
      pauseGenerationRef.current = false;
      dispatch({ type: "START_GENERATION" });

      // Generar template inicial
      const result = await generateWithAI(
        state.content,
        state.message,
        state.domain
      );

      // Verificar que el template existe
      const { template: currentTemplate } = result;
      if (!currentTemplate) {
        console.error("[ERROR] Template no recibido en la respuesta");
        toast.error("No se pudo generar el template. Intenta nuevamente.");
        dispatch({
          type: "SET_ERROR",
          message: "No se pudo generar el template",
        });
        return;
      }

      // Actualizar UI con el template generado
      updateUIWithTemplate(
        currentTemplate,
        result.lastProcessedLine,
        result.totalLines
      );

      if (currentTemplate && currentTemplate.id) {
        // Asegurarse de que lastProcessedLine sea un número válido
        const lastLine =
          typeof result.lastProcessedLine === "number"
            ? result.lastProcessedLine
            : 0;

        setTimeout(() => {
          if (!result.createdIds?.applicationId) {
            console.error(
              "[ERROR] No se encontró applicationId en la respuesta"
            );
            toast.error("Error: No se pudo continuar la generación");
            dispatch({
              type: "SET_ERROR",
              message: "No se encontró applicationId en la respuesta",
            });
            return;
          }
          continuarGeneracion(
            currentTemplate,
            lastLine,
            result.createdIds.applicationId
          );
        }, 100);
      } else {
        console.error(
          "[ERROR] No se puede continuar, template inválido",
          currentTemplate
        );
      }
    } catch (error) {
      console.error("Error al generar template:", error);
      dispatch({ type: "SET_ERROR", message: "Error al generar template" });
    }
  };

  const handleClose = () => {
    handleReset();
    if (onTemplateGenerated) onTemplateGenerated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <img src="/mvp/bot.svg" alt="IA" className="w-5 h-5" />
          Generar Template con IA
        </h2>
        {!state.isGenerating ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido *
              </label>
              <textarea
                value={state.content}
                onChange={e =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "content",
                    value: e.target.value,
                  })
                }
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
                value={state.domain}
                onChange={e =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "domain",
                    value: e.target.value,
                  })
                }
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
                value={state.message}
                onChange={e =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "message",
                    value: e.target.value,
                  })
                }
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
                disabled={state.isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="!h-auto py-1.5 px-3"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
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
                {state.processingStatus || "Procesando..."}
              </p>
              <div className="mt-2">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${state.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {state.generatedTemplates.length > 0 && (
              <div className="mb-4 max-h-60 overflow-y-auto">
                <h3 className="font-medium text-gray-800 mb-2">
                  Templates generados ({state.generatedTemplates.length})
                </h3>
                {state.generatedTemplates.map((template, index) => (
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
                onClick={handlePause}
                type="button"
                className="!h-auto py-1.5 px-3"
                disabled={!state.isLoading || state.isPaused}
              >
                {state.isPaused ? "Generación pausada" : "Pausar generación"}
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
