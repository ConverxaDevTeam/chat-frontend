import React, { useState, useEffect } from "react";
import { FiPlus, FiGrid, FiSettings } from "react-icons/fi";
import { toast } from "react-toastify";
import { FunctionTemplate } from "@interfaces/template.interface";
import { functionTemplateService } from "@services/template.service";
import FunctionTemplateModal from "@components/FunctionTemplateModal";
import FunctionTemplateCard from "@components/FunctionTemplateCard";
import { Button } from "@components/common/Button";
import { useSelector } from "react-redux";
import { RootState } from "@store";

const TemplateCreation: React.FC = () => {
  // Estados
  const [templates, setTemplates] = useState<FunctionTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    FunctionTemplate | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener organización del usuario
  const { myOrganizations } = useSelector((state: RootState) => state.auth);
  const organizationId = myOrganizations[0]?.organization?.id || 0;

  // Cargar templates al montar el componente
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Obtener templates desde el servidor
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

  // Manejadores de eventos
  const handleOpenModal = (template?: FunctionTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(undefined);
    setIsModalOpen(false);
  };

  const handleSubmit = async (templateData: FunctionTemplate) => {
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

  const handleEditTemplate = async (
    _id: number,
    template: Partial<FunctionTemplate>
  ) => {
    handleOpenModal(template as FunctionTemplate);
  };

  // Renderizado condicional basado en el estado
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sofia-blue"></div>
        </div>
      );
    }

    if (templates.length === 0) {
      return (
        <div className="bg-white rounded-lg text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-4">
              <FiSettings className="text-gray-500" size={24} />
            </div>
            <p className="text-gray-600 mb-5">No hay templates disponibles</p>
            <Button
              variant="primary"
              onClick={() => handleOpenModal()}
              className="!flex-none !h-auto text-sm py-1 px-3 flex items-center gap-1"
            >
              <FiPlus size={16} /> Crear primer template
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <FunctionTemplateCard
            key={template.id}
            template={template}
            onDelete={handleDeleteTemplate}
            onEdit={handleEditTemplate}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <span className="text-gray-800 mr-2 inline-block">
            <FiGrid size={18} />
          </span>
          <div>
            <div className="text-gray-800 font-medium">
              Templates de Funciones
            </div>
            <div className="text-gray-500 text-xs">
              Crea y administra templates para automatizar funciones
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="!flex-none !h-auto text-sm py-1 px-3 flex items-center gap-1"
        >
          <FiPlus size={16} /> Crear Template
        </Button>
      </div>

      {renderContent()}

      <FunctionTemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedTemplate}
      />
    </div>
  );
};

export default TemplateCreation;
