import React, { useState, useEffect } from "react";
import { FunctionTemplate } from "@interfaces/template.interface";
import ConfigPanel from "@components/ConfigPanel";
import Modal from "@components/Modal";
import {
  useTemplateData,
  useSelectOptions,
  useTemplateForm,
  useTabNavigation,
} from "./FunctionTemplateHooks";
import { ActionButtons } from "./FunctionTemplateBasicComponents";
import { TabContent } from "./FunctionTemplateTabContent";
import { getTemplateById } from "@services/template.service"; // Assuming getTemplateById is defined in a template service file

interface FunctionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: FunctionTemplate) => Promise<void>;
  templateId?: number;
}

const FunctionTemplateModal: React.FC<FunctionTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  templateId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<FunctionTemplate>>({});

  useEffect(() => {
    const loadTemplateData = async () => {
      if (!templateId) {
        setInitialData({});
        return;
      }

      try {
        setIsLoading(true);
        const template = await getTemplateById(templateId);
        if (template) setInitialData(template);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplateData();
  }, [templateId]);

  // No se utiliza imagen en este formulario
  const { register, handleSubmit, control, processSubmit } = useTemplateForm(
    onSubmit,
    isOpen,
    initialData as FunctionTemplate
  );
  const { categories, applications } = useTemplateData(isOpen);
  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  } = useTabNavigation(isOpen);
  const { categoryOptions, applicationOptions } = useSelectOptions(
    categories,
    applications
  );

  if (!isOpen) return null;

  const title = `${initialData ? "Editar" : "Crear"} Template de Función`;
  const handleFormSubmit = handleSubmit(processSubmit);

  // Preparar el contenido del modal
  const modalContent = (
    <div className="w-full">
      <ConfigPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <ActionButtons
            isFirstTab={isFirstTab}
            isLastTab={isLastTab}
            goToPreviousTab={goToPreviousTab}
            goToNextTab={goToNextTab}
            onSubmit={handleFormSubmit}
          />
        }
      >
        <div className="w-full max-w-md mx-auto">
          <TabContent
            activeTab={activeTab}
            register={register}
            control={control}
            categoryOptions={categoryOptions}
            applicationOptions={applicationOptions}
          />
        </div>
      </ConfigPanel>
    </div>
  );

  // Preparar el header del modal
  const modalHeader = <div>{title}</div>;

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={modalHeader}
      zindex={1000}
    >
      {isLoading ? <div>Cargando...</div> : modalContent}
    </Modal>
  );
};

export default FunctionTemplateModal;
