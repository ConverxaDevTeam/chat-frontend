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
} from "@services/template.service";

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

  const handleOpenModal = (template?: FunctionTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(undefined);
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    selectedTemplate,
    handleOpenModal,
    handleCloseModal,
  };
};

// Componente para el encabezado
const TemplateHeader: React.FC<{ onOpenModal: () => void }> = ({
  onOpenModal,
}) => (
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
    <Button
      variant="primary"
      onClick={onOpenModal}
      className="!flex-none !h-auto text-sm py-1 px-3 flex items-center gap-1"
    >
      <FiPlus size={16} /> Crear Template
    </Button>
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
  // Depuración: Verificar los datos de categoría y aplicación
  console.log("Template row data:", {
    id: template.id,
    name: template.name,
    categoryId: template.categoryId,
    category: template.category,
    applicationId: template.applicationId,
    application: template.application,
  });
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

// Componente principal
const TemplateCreation: React.FC = () => {
  // Usar hooks personalizados
  const { templates, isLoading, fetchTemplates } = useTemplates();
  const { isModalOpen, selectedTemplate, handleOpenModal, handleCloseModal } =
    useTemplateModal();
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

  // Renderizado condicional
  const { renderContent } = useConditionalRendering(
    isLoading,
    templates,
    templateHandlers
  );

  return (
    <div className="container mx-auto px-4 py-5">
      <TemplateHeader onOpenModal={() => handleOpenModal()} />

      {renderContent()}

      <FunctionTemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={templateData =>
          handleSubmit(templateData, selectedTemplate, handleCloseModal)
        }
        templateId={selectedTemplate?.id}
      />
    </div>
  );
};

export default TemplateCreation;
