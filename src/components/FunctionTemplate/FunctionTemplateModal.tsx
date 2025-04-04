import React from "react";
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

interface FunctionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: FunctionTemplate) => Promise<void>;
  initialData?: FunctionTemplate;
}

const FunctionTemplateModal: React.FC<FunctionTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // No se utiliza imagen en este formulario
  const { register, handleSubmit, control, processSubmit } = useTemplateForm(
    onSubmit,
    isOpen,
    initialData
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
      {modalContent}
    </Modal>
  );
};

export default FunctionTemplateModal;
