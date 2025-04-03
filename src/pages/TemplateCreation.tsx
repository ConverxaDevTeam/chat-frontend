import React, { useState, useEffect } from "react";
import { FiPlus, FiGrid, FiSettings } from "react-icons/fi";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import { functionTemplateService } from "@services/template.service";
import FunctionTemplateModal from "@components/FunctionTemplate/FunctionTemplateModal";
import FunctionTemplateCard from "@components/FunctionTemplate/FunctionTemplateCard";
import { Button } from "@components/common/Button";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import Loading from "@components/Loading";

// Tipos
type TemplateHandlers = {
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, template: Partial<FunctionTemplate>) => Promise<void>;
  onOpenModal: (template?: FunctionTemplate) => void;
};

// Hook personalizado para manejar templates
const useTemplates = (organizationId: number) => {
  const [templates, setTemplates] = useState<FunctionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await functionTemplateService.getTemplates(organizationId);
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
        <FiSettings className="text-gray-500" size={24} />
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

// Componente para la cuadrícula de templates
const TemplateGrid: React.FC<{
  templates: FunctionTemplate[];
  handlers: TemplateHandlers;
}> = ({ templates, handlers }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {templates.map(template => (
      <FunctionTemplateCard
        key={template.id}
        template={template}
        onDelete={handlers.onDelete}
        onEdit={handlers.onEdit}
      />
    ))}
  </div>
);

// Hook para manejar operaciones de templates
const useTemplateOperations = (
  organizationId: number,
  fetchTemplates: () => Promise<void>
) => {
  const handleSubmit = async (
    templateData: FunctionTemplate,
    selectedTemplate: FunctionTemplate | undefined,
    handleCloseModal: () => void
  ) => {
    try {
      templateData.organizationId = organizationId;

      if (selectedTemplate) {
        templateData.id = selectedTemplate.id;
        await functionTemplateService.updateTemplate(
          templateData.id,
          templateData
        );
        toast.success("Template actualizado correctamente");
      } else {
        await functionTemplateService.createTemplate(templateData);
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
      await functionTemplateService.deleteTemplate(id);
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

    return <TemplateGrid templates={templates} handlers={handlers} />;
  };

  return { renderContent };
};

// Componente principal
const TemplateCreation: React.FC = () => {
  // Obtener organización del usuario
  const { myOrganizations } = useSelector((state: RootState) => state.auth);
  const organizationId = myOrganizations[0]?.organization?.id || 0;

  // Usar hooks personalizados
  const { templates, isLoading, fetchTemplates } = useTemplates(organizationId);
  const { isModalOpen, selectedTemplate, handleOpenModal, handleCloseModal } =
    useTemplateModal();
  const { handleSubmit, handleDeleteTemplate } = useTemplateOperations(
    organizationId,
    fetchTemplates
  );

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
        initialData={selectedTemplate}
      />
    </div>
  );
};

export default TemplateCreation;
