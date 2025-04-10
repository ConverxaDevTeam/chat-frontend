import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiGrid } from "react-icons/fi";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import FunctionTemplateModal from "@components/FunctionTemplate/FunctionTemplateModal";
import { Button } from "@components/common/Button";
import Loading from "@components/Loading";
import ContextMenu from "@components/ContextMenu";
import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  updateTemplate,
  generateTemplateWithAI,
  continueTemplateGenerationWithAI,
} from "@services/template.service";
import { Input } from "@components/forms/input";

// Tipos
type TemplateHandlers = {
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, template: Partial<FunctionTemplate>) => Promise<void>;
  onOpenModal: (template?: FunctionTemplate) => void;
};

// Hook personalizado para manejar templates
const useTemplates = () => {
  const [templates, setTemplates] = useState<FunctionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error al cargar templates:", error);
      toast.error("Error al cargar los templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, isLoading, fetchTemplates };
};

// Hook personalizado para manejar el modal
const useTemplateModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    FunctionTemplate | undefined
  >(undefined);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleOpenModal = (template?: FunctionTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(undefined);
    setIsModalOpen(false);
  };

  const handleOpenAIModal = () => {
    setIsAIModalOpen(true);
  };

  const handleCloseAIModal = () => {
    setIsAIModalOpen(false);
  };

  return {
    isModalOpen,
    selectedTemplate,
    handleOpenModal,
    handleCloseModal,
    isAIModalOpen,
    handleOpenAIModal,
    handleCloseAIModal,
  };
};

// Componente para el encabezado
const TemplateHeader: React.FC<{
  onOpenModal: () => void;
  onOpenAIModal: () => void;
}> = ({ onOpenModal, onOpenAIModal }) => (
  <div className="flex justify-between items-center mb-5">
    <div className="flex items-center">
      <span className="text-gray-800 mr-2 inline-block">
        <FiGrid size={18} />
      </span>
      <div>
        <div className="text-gray-800 font-medium">Templates de Funciones</div>
        <div className="text-gray-500 text-xs">
          Crea y administra templates para automatizar funciones
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <Button
        onClick={onOpenAIModal}
        className="!flex-none !h-auto text-sm py-1 px-3 flex items-center gap-1"
      >
        <img src="/mvp/bot.svg" alt="IA" className="w-4 h-4" /> Generar con IA
      </Button>
      <Button
        variant="primary"
        onClick={onOpenModal}
        className="!flex-none !h-auto text-sm py-1 px-3 flex items-center gap-1"
      >
        <FiPlus size={16} /> Crear Template
      </Button>
    </div>
  </div>
);

// Componente para el spinner de carga
const LoadingSpinner: React.FC = () => (
  <div className="h-64">
    <Loading />
  </div>
);

// Componente para el estado vacío
const EmptyState: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => (
  <div className="bg-white rounded-lg text-center">
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-4">
        <FiGrid className="text-gray-500" size={24} />
      </div>
      <p className="text-gray-600 mb-5">No hay templates disponibles</p>
      <Button
        variant="primary"
        onClick={onOpenModal}
        className="!flex-none !h-auto text-sm py-1 px-3 flex items-center gap-1"
      >
        <FiPlus size={16} /> Crear primer template
      </Button>
    </div>
  </div>
);

// Hook para manejar el menú contextual
const useContextMenu = (
  handlers: TemplateHandlers,
  template: FunctionTemplate
) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({ x: rect.right, y: rect.top });
      setShowContextMenu(true);
    }
  };

  const handleCloseMenu = () => setShowContextMenu(false);

  const handleEdit = () => {
    handlers.onEdit(template.id, template);
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este template?")) {
      await handlers.onDelete(template.id);
    }
    handleCloseMenu();
  };

  return {
    showContextMenu,
    menuPosition,
    menuButtonRef,
    handleOpenMenu,
    handleCloseMenu,
    handleEdit,
    handleDelete,
  };
};

// Componente para el menú contextual
const TemplateContextMenu: React.FC<{
  show: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ show, position, onClose, onEdit, onDelete }) => {
  if (!show) return null;
  return (
    <ContextMenu x={position.x} y={position.y} onClose={onClose}>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 w-full text-left"
      >
        <img src="/mvp/pencil.svg" alt="Editar" className="w-4 h-4" />
        <span>Editar</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 w-full text-left"
      >
        <img src="/mvp/trash.svg" alt="Eliminar" className="w-4 h-4" />
        <span>Eliminar</span>
      </button>
    </ContextMenu>
  );
};

// Componente para mostrar etiquetas
const TagsList: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return <span className="text-gray-500 text-xs">Sin etiquetas</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 2).map((tag, i) => (
        <div
          key={i}
          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
        >
          {tag}
        </div>
      ))}
      {tags.length > 2 && (
        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
          +{tags.length - 2}
        </div>
      )}
    </div>
  );
};

// Componente para la fila de template
const TemplateRow: React.FC<{
  template: FunctionTemplate;
  handlers: TemplateHandlers;
}> = ({ template, handlers }) => {
  const {
    showContextMenu,
    menuPosition,
    menuButtonRef,
    handleOpenMenu,
    handleCloseMenu,
    handleEdit,
    handleDelete,
  } = useContextMenu(handlers, template);

  return (
    <>
      <TemplateContextMenu
        show={showContextMenu}
        position={menuPosition}
        onClose={handleCloseMenu}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <tr className="h-[60px] border-b-[1px] border-[#DBEAF2] hover:bg-gray-50">
        <td className="py-2.5 px-6">
          <span className="font-medium text-gray-900">{template.name}</span>
        </td>
        <td className="py-2.5 px-6">
          <p
            className="text-sm font-medium text-gray-600 truncate max-w-[200px]"
            title={template.description}
          >
            {template.description}
          </p>
        </td>
        <td className="py-2.5 px-6">
          <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs">
            {template.category?.name || "Sin categoría"}
          </span>
        </td>
        <td className="py-2.5 px-6">
          <span className="bg-purple-100 text-purple-800 py-1 px-2 rounded text-xs">
            {template.application?.name || "Sin aplicación"}
          </span>
        </td>
        <td className="py-2.5 px-6">
          <TagsList tags={template.tags} />
        </td>
        <td className="py-2.5 px-6 first:rounded-tr-[8px] last:rounded-br-[8px]">
          <div className="flex justify-end">
            <button
              ref={menuButtonRef}
              onClick={handleOpenMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <img
                src="/mvp/three-dots.svg"
                alt="Opciones"
                className="w-5 h-5"
              />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

// Componente para la tabla de templates
const TemplateTable: React.FC<{
  templates: FunctionTemplate[];
  handlers: TemplateHandlers;
}> = ({ templates, handlers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-[8px] shadow-sm">
        <thead className="bg-gray-50 border-b-[1px] border-[#DBEAF2]">
          <tr>
            <th className="py-3 px-6 text-left font-medium text-gray-500 text-sm">
              Nombre
            </th>
            <th className="py-3 px-6 text-left font-medium text-gray-500 text-sm">
              Descripción
            </th>
            <th className="py-3 px-6 text-left font-medium text-gray-500 text-sm">
              Categoría
            </th>
            <th className="py-3 px-6 text-left font-medium text-gray-500 text-sm">
              Aplicación
            </th>
            <th className="py-3 px-6 text-left font-medium text-gray-500 text-sm">
              Etiquetas
            </th>
            <th className="py-3 px-6 text-right font-medium text-gray-500 text-sm">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {templates.map(template => (
            <TemplateRow
              key={template.id}
              template={template}
              handlers={handlers}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Hook para manejar operaciones de templates
const useTemplateOperations = (fetchTemplates: () => Promise<void>) => {
  const handleSubmit = async (
    templateData: FunctionTemplate,
    selectedTemplate: FunctionTemplate | undefined,
    handleCloseModal: () => void
  ) => {
    try {
      if (selectedTemplate) {
        templateData.id = selectedTemplate.id;
        await updateTemplate(templateData.id, templateData);
        toast.success("Template actualizado correctamente");
      } else {
        await createTemplate(templateData);
        toast.success("Template creado correctamente");
      }

      handleCloseModal();
      fetchTemplates();
    } catch (error) {
      console.error("Error al guardar template:", error);
      toast.error("Error al guardar el template");
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    try {
      await deleteTemplate(id);
      toast.success("Template eliminado correctamente");
      fetchTemplates();
    } catch (error) {
      console.error("Error al eliminar template:", error);
      toast.error("Error al eliminar el template");
    }
  };

  return { handleSubmit, handleDeleteTemplate };
};

// Hook para manejar el renderizado condicional
const useConditionalRendering = (
  isLoading: boolean,
  templates: FunctionTemplate[],
  handlers: TemplateHandlers
) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (templates.length === 0) {
      return <EmptyState onOpenModal={() => handlers.onOpenModal()} />;
    }

    return <TemplateTable templates={templates} handlers={handlers} />;
  };

  return { renderContent };
};

// Modal para generar templates con IA
const AIGeneratorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    content: string,
    message: string,
    domain?: string
  ) => Promise<FunctionTemplate>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [generationState, setGenerationState] = useState<{
    template: FunctionTemplate | null;
    lastProcessedLine: number;
    createdIds: {
      applicationId?: string;
      categoryIds?: string[];
    };
  }>({
    template: null,
    lastProcessedLine: 0,
    createdIds: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("El contenido es requerido");
      return;
    }

    try {
      setIsLoading(true);
      setIsGenerating(true);
      const template = await onSubmit(content, message, domain);
      setGenerationState({
        template,
        lastProcessedLine: template.lastProcessedLine || 0,
        createdIds: template.createdIds || {},
      });
    } catch (error) {
      console.error("Error al generar template:", error);
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueGeneration = async () => {
    if (!generationState.template || !content) {
      toast.error("Se requiere contenido para continuar");
      return;
    }

    try {
      setIsLoading(true);
      const updatedTemplate = await continueTemplateGenerationWithAI(
        content,
        message,
        generationState.lastProcessedLine,
        generationState.template.id,
        generationState.template.categoryId,
        generationState.template.applicationId ||
          (generationState.createdIds.applicationId
            ? Number(generationState.createdIds.applicationId)
            : undefined),
        domain,
        {
          ...generationState.createdIds,
          applicationId:
            generationState.createdIds.applicationId ||
            (generationState.template.applicationId
              ? generationState.template.applicationId.toString()
              : undefined),
        }
      );

      setGenerationState(prev => ({
        ...prev,
        template: updatedTemplate,
        lastProcessedLine:
          updatedTemplate.lastProcessedLine || prev.lastProcessedLine,
        createdIds: {
          ...prev.createdIds,
          applicationId: updatedTemplate.applicationId
            ? updatedTemplate.applicationId.toString()
            : prev.createdIds.applicationId,
        },
      }));

      toast.success("Generación continuada exitosamente");
    } catch (error) {
      console.error("Error al continuar generación:", error);
      toast.error("Error al continuar la generación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setMessage("");
    setDomain("");
    setGenerationState({
      template: null,
      lastProcessedLine: 0,
      createdIds: {},
    });
    setIsGenerating(false);
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
        ) : generationState.template ? (
          <div>
            <div className="mb-4 border-b pb-2">
              <h3 className="font-medium text-gray-800">Template generado</h3>
              <p className="text-sm text-gray-600 mt-1">
                {generationState.template.name}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-1">Descripción</h3>
              <p className="text-sm text-gray-600">
                {generationState.template.description}
              </p>
            </div>
            {generationState.template.tags &&
              generationState.template.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-1">Etiquetas</h3>
                  <div className="flex flex-wrap gap-1">
                    {generationState.template.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
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
                onClick={handleContinueGeneration}
                type="button"
                className="!h-auto py-1.5 px-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loading /> Procesando...
                  </span>
                ) : (
                  "Continuar generación"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Loading />
            <p className="mt-4 text-gray-600">Generando template...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal
const TemplateCreation: React.FC = () => {
  // Usar hooks personalizados
  const { templates, isLoading, fetchTemplates } = useTemplates();
  const {
    isModalOpen,
    selectedTemplate,
    handleOpenModal,
    handleCloseModal,
    isAIModalOpen,
    handleOpenAIModal,
    handleCloseAIModal,
  } = useTemplateModal();
  const { handleSubmit, handleDeleteTemplate } =
    useTemplateOperations(fetchTemplates);

  // Manejador para editar template
  const handleEditTemplate = async (
    _id: number,
    template: Partial<FunctionTemplate>
  ) => {
    handleOpenModal(template as FunctionTemplate);
  };

  // Handlers agrupados para pasar a componentes
  const templateHandlers: TemplateHandlers = {
    onDelete: handleDeleteTemplate,
    onEdit: handleEditTemplate,
    onOpenModal: handleOpenModal,
  };

  // Manejador para generar template con IA
  const handleGenerateWithAI = async (
    content: string,
    message: string,
    domain?: string
  ) => {
    try {
      toast.info("Generando template con IA...");
      const generatedTemplate = await generateTemplateWithAI(
        content,
        message,
        domain
      );
      toast.success("Template generado correctamente");
      fetchTemplates();
      console.log("generatedTemplate", generatedTemplate);
      return generatedTemplate;
    } catch (error) {
      console.error("Error al generar template con IA:", error);
      toast.error("Error al generar el template con IA");
      throw error;
    }
  };

  // Renderizado condicional
  const { renderContent } = useConditionalRendering(
    isLoading,
    templates,
    templateHandlers
  );

  return (
    <div className="container mx-auto px-4 py-5">
      <TemplateHeader
        onOpenModal={() => handleOpenModal()}
        onOpenAIModal={handleOpenAIModal}
      />

      {renderContent()}

      <FunctionTemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={templateData =>
          handleSubmit(templateData, selectedTemplate, handleCloseModal)
        }
        templateId={selectedTemplate?.id}
      />

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={handleCloseAIModal}
        onSubmit={handleGenerateWithAI}
      />
    </div>
  );
};

export default TemplateCreation;
