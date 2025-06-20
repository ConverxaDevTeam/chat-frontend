import React, { useState, useEffect } from "react";
import { FunctionTemplate } from "@interfaces/template.interface";
import Modal from "@components/Modal";
import {
  useTemplateData,
  useSelectOptions,
  useTemplateForm,
  useTabNavigation,
} from "./FunctionTemplateHooks";
import { ActionButtons } from "./FunctionTemplateBasicComponents";
import { TabContent } from "./FunctionTemplateTabContent";
import { getTemplateById } from "@services/template.service";

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
  const [initialData, setInitialData] = useState<FunctionTemplate | null>(null);

  useEffect(() => {
    if (isOpen && templateId) {
      getTemplateById(templateId).then(setInitialData);
    } else {
      setInitialData(null);
    }
  }, [isOpen, templateId]);

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

  const handleFormSubmit = handleSubmit(processSubmit);

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      zindex={1000}
    >
      <div className="w-[1180px] h-[719px] bg-sofia-blancoPuro shadow-lg rounded">
        <div className="flex flex-col h-full">
          <div className="flex pt-2">
            <div className="w-[200px] relative px-3">
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#DBEAF2]" />
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`py-2 px-3 mb-2 cursor-pointer rounded ${activeTab === tab.id ? 'bg-sofia-superDark font-normal text-white' : 'hover:bg-sofia-electricGreen-100'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
            <div className="flex-1 px-4 max-h-[500px]">
              <div className="w-full">
                <TabContent
                  activeTab={activeTab}
                  register={register}
                  control={control}
                  categoryOptions={categoryOptions}
                  applicationOptions={applicationOptions}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pr-[24px] pb-[24px] mt-auto">
            <ActionButtons
              isFirstTab={isFirstTab}
              isLastTab={isLastTab}
              goToPreviousTab={goToPreviousTab}
              goToNextTab={goToNextTab}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FunctionTemplateModal;
