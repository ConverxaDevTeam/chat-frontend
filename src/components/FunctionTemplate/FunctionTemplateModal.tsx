import React from "react";
import {
  UseFormRegister,
  Control,
  FieldError,
  FieldErrors,
} from "react-hook-form";
import { FunctionTemplate } from "@interfaces/template.interface";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";
import { TextArea } from "@components/forms/textArea";
import ConfigPanel from "@components/ConfigPanel";
import Modal from "@components/Modal";
import {
  useImageUpload,
  useTemplateData,
  useSelectOptions,
  useTemplateForm,
  useTabNavigation,
  FormValues,
} from "./FunctionTemplateHooks";

interface TemplateNameFieldProps {
  register: UseFormRegister<FormValues>;
  error?: FieldError;
}

interface TemplateDescriptionFieldProps {
  register: UseFormRegister<FormValues>;
  error?: FieldError;
}

interface TemplateSelectFieldProps {
  control: Control<FormValues>;
  name: keyof FormValues;
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: FieldError;
  placeholder?: string;
}

interface TemplateUrlFieldProps {
  register: UseFormRegister<FormValues>;
  error?: FieldError;
}

interface TemplateTagsFieldProps {
  register: UseFormRegister<FormValues>;
}

interface TemplateImageUploaderProps {
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FunctionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: FunctionTemplate) => Promise<void>;
  initialData?: FunctionTemplate;
}

// Componentes atómicos
const TemplateNameField: React.FC<TemplateNameFieldProps> = ({
  register,
  error,
}) => (
  <InputGroup label="Nombre" errors={error}>
    <Input
      {...register("name", { required: "El nombre es obligatorio" })}
      placeholder="Nombre del template"
      className="w-full"
    />
  </InputGroup>
);

const TemplateDescriptionField: React.FC<TemplateDescriptionFieldProps> = ({
  register,
  error,
}) => (
  <InputGroup label="Descripción" errors={error}>
    <TextArea
      register={register("description", {
        required: "La descripción es obligatoria",
      })}
      placeholder="Describe tu template"
      className="w-full"
      rows={3}
    />
  </InputGroup>
);

const TemplateSelectField: React.FC<TemplateSelectFieldProps> = ({
  control,
  name,
  label,
  options,
  error,
  placeholder,
}) => (
  <InputGroup label={label} errors={error}>
    <Select
      control={control}
      name={name}
      options={options}
      placeholder={placeholder || "Seleccionar..."}
      rules={{ required: `Selecciona una ${label.toLowerCase()}` }}
    />
  </InputGroup>
);

const TemplateUrlField: React.FC<TemplateUrlFieldProps> = ({
  register,
  error,
}) => (
  <InputGroup label="URL del Endpoint" errors={error}>
    <Input
      {...register("url", { required: "La URL es obligatoria" })}
      placeholder="https://api.example.com/endpoint"
      className="w-full"
    />
  </InputGroup>
);

const TemplateTagsField: React.FC<TemplateTagsFieldProps> = ({ register }) => (
  <InputGroup label="Tags (separados por comas)">
    <Input
      {...register("tags")}
      placeholder="tag1, tag2, tag3"
      className="w-full"
    />
  </InputGroup>
);

const TemplateImageUploader: React.FC<TemplateImageUploaderProps> = ({
  previewImage,
  onImageChange,
}) => (
  <InputGroup label="Imagen (opcional)">
    <div className="flex items-center space-x-4">
      {previewImage && (
        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="text-sm text-gray-500"
      />
    </div>
  </InputGroup>
);

// Componentes para las pestañas
interface BasicInfoContentProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  applicationOptions: Array<{ value: string; label: string }>;
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoContent: React.FC<BasicInfoContentProps> = ({
  register,
  control,
  errors,
  categoryOptions,
  applicationOptions,
  previewImage,
  onImageChange,
}) => (
  <div className="space-y-6 py-4">
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      Datos principales
    </h3>
    <TemplateNameField register={register} error={errors.name} />
    <TemplateDescriptionField register={register} error={errors.description} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TemplateSelectField
        control={control}
        name="categoryId"
        label="Categoría"
        options={categoryOptions}
        error={errors.categoryId}
        placeholder="Seleccionar categoría"
      />
      <TemplateSelectField
        control={control}
        name="applicationId"
        label="Aplicación"
        options={applicationOptions}
        error={errors.applicationId}
        placeholder="Seleccionar aplicación"
      />
    </div>
    <TemplateImageUploader
      previewImage={previewImage}
      onImageChange={onImageChange}
    />
  </div>
);

interface ConfigContentProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

const ConfigContent: React.FC<ConfigContentProps> = ({ register, errors }) => (
  <div className="space-y-6 py-4">
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      Configuración del endpoint
    </h3>
    <TemplateUrlField register={register} error={errors.url} />
    <TemplateTagsField register={register} />
  </div>
);

interface TabContentProps {
  activeTab: string;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  applicationOptions: Array<{ value: string; label: string }>;
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  register,
  control,
  errors,
  categoryOptions,
  applicationOptions,
  previewImage,
  onImageChange,
}) => {
  switch (activeTab) {
    case "info":
      return (
        <BasicInfoContent
          register={register}
          control={control}
          errors={{
            name: errors.name,
            description: errors.description,
            categoryId: errors.categoryId,
            applicationId: errors.applicationId,
          }}
          categoryOptions={categoryOptions}
          applicationOptions={applicationOptions}
          previewImage={previewImage}
          onImageChange={onImageChange}
        />
      );
    case "config":
      return (
        <ConfigContent
          register={register}
          errors={{
            url: errors.url,
            tags: errors.tags,
          }}
        />
      );
    default:
      return null;
  }
};

// Componente para los botones de acción
interface ActionButtonsProps {
  isFirstTab: boolean;
  isLastTab: boolean;
  goToPreviousTab: () => void;
  goToNextTab: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFirstTab,
  isLastTab,
  goToPreviousTab,
  goToNextTab,
  onSubmit,
}) => (
  <div className="flex gap-[10px]">
    {!isFirstTab && <Button onClick={goToPreviousTab}>Anterior</Button>}
    {!isLastTab ? (
      <Button variant="primary" onClick={goToNextTab}>
        Siguiente
      </Button>
    ) : (
      <Button variant="primary" onClick={onSubmit}>
        Guardar
      </Button>
    )}
  </div>
);

const FunctionTemplateModal: React.FC<FunctionTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // No hay campo de imagen en la interfaz FunctionTemplate
  const { previewImage, handleImageChange } = useImageUpload(isOpen);
  const { register, handleSubmit, control, errors, processSubmit } =
    useTemplateForm(onSubmit, isOpen, initialData);
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
            errors={errors}
            categoryOptions={categoryOptions}
            applicationOptions={applicationOptions}
            previewImage={previewImage}
            onImageChange={handleImageChange}
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
