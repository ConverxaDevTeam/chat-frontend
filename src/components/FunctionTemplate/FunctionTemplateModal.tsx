import React, { useState, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  Control,
  FieldError,
} from "react-hook-form";
import { FiX } from "react-icons/fi";
import {
  FunctionTemplate,
  FunctionTemplateCategory,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";
import { TextArea } from "@components/forms/textArea";
import { functionTemplateService } from "@services/template.service";
import ConfigPanel from "@components/ConfigPanel";

interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  applicationId: string;
  url: string;
  tags: string;
}

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

// Custom hooks
const useImageUpload = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return { previewImage, handleImageChange };
};

const useTemplateForm = (
  onSubmit: (template: FunctionTemplate) => Promise<void>
) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const processSubmit: SubmitHandler<FormValues> = async data => {
    const tagsArray = data.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const templateData: FunctionTemplate = {
      id: 0,
      name: data.name,
      description: data.description,
      categoryId: parseInt(data.categoryId),
      applicationId: parseInt(data.applicationId),
      url: data.url,
      params: [],
      tags: tagsArray,
      organizationId: 0,
    };

    await onSubmit(templateData);
  };

  return { register, handleSubmit, control, errors, processSubmit };
};

const useTemplateData = (isOpen: boolean) => {
  const [categories, setCategories] = useState<FunctionTemplateCategory[]>([]);
  const [applications, setApplications] = useState<
    FunctionTemplateApplication[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [categoriesData, applicationsData] = await Promise.all([
            functionTemplateService.getCategories(),
            functionTemplateService.getApplications(),
          ]);
          setCategories(categoriesData);
          setApplications(applicationsData);
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  return { categories, applications };
};

// Componentes para las pestañas
interface BasicInfoContentProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: {
    name?: FieldError;
    description?: FieldError;
    categoryId?: FieldError;
    applicationId?: FieldError;
  };
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
  errors: {
    url?: FieldError;
    tags?: FieldError;
  };
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
  errors: {
    name?: FieldError;
    description?: FieldError;
    categoryId?: FieldError;
    applicationId?: FieldError;
    url?: FieldError;
    tags?: FieldError;
  };
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

const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState("info");
  const tabs = [
    {
      id: "info",
      label: "Información básica",
      icon: <img src="/mvp/settings.svg" className="w-5 h-5" />,
    },
    {
      id: "config",
      label: "Configuración",
      icon: <img src="/mvp/square-code.svg" className="w-5 h-5" />,
    },
  ];
  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const isFirstTab = activeTab === tabs[0].id;
  const isLastTab = activeTab === tabs[tabs.length - 1].id;

  return {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  };
};

// Hook para manejar las opciones de categorías y aplicaciones
const useSelectOptions = (
  categories: FunctionTemplateCategory[],
  applications: FunctionTemplateApplication[]
) => {
  const categoryOptions = categories.map(category => ({
    value: String(category.id),
    label: category.name,
  }));

  const applicationOptions = applications.map(app => ({
    value: String(app.id),
    label: app.name,
  }));

  return { categoryOptions, applicationOptions };
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

// Componente para el encabezado del modal
interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className="flex justify-between items-center border-b px-5 py-3">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      <FiX size={20} />
    </button>
  </div>
);

const FunctionTemplateModal: React.FC<FunctionTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { previewImage, handleImageChange } = useImageUpload();
  const { register, handleSubmit, control, errors, processSubmit } =
    useTemplateForm(onSubmit);
  const { categories, applications } = useTemplateData(isOpen);
  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  } = useTabNavigation();
  const { categoryOptions, applicationOptions } = useSelectOptions(
    categories,
    applications
  );

  if (!isOpen) return null;

  const title = `${initialData ? "Editar" : "Crear"} Template de Función`;
  const handleFormSubmit = handleSubmit(processSubmit);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        <ModalHeader title={title} onClose={onClose} />
        <div className="p-5">
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
      </div>
    </div>
  );
};

export default FunctionTemplateModal;
