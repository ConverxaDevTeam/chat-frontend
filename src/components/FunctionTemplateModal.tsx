import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FiX } from "react-icons/fi";
import {
  FunctionTemplate,
  FunctionTemplateCategory,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";
import { Input } from "@components/forms/input";
import { Button } from "@components/common/Button";
import { TextArea } from "@components/forms/textArea";
import { functionTemplateService } from "@services/template.service";

// Tipo para los valores del formulario
interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  applicationId: string;
  url: string;
  tags: string;
}

// Interfaz para las props del modal
interface FunctionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: FunctionTemplate) => Promise<void>;
  initialData?: FunctionTemplate;
}

// Hook para manejar la carga de imágenes
const useImageUpload = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return { previewImage, handleImageChange };
};

// Hook para manejar el formulario
const useTemplateForm = (
  onSubmit: (template: FunctionTemplate) => Promise<void>
) => {
  const [categories, setCategories] = useState<FunctionTemplateCategory[]>([]);
  const [applications, setApplications] = useState<
    FunctionTemplateApplication[]
  >([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await functionTemplateService.getCategories();
        const applicationsData =
          await functionTemplateService.getApplications();
        setCategories(categoriesData);
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const processSubmit: SubmitHandler<FormValues> = async data => {
    // Convertir tags de string a array
    const tagsArray = data.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const templateData: FunctionTemplate = {
      id: 0, // Se asignará en el backend/servicio
      name: data.name,
      description: data.description,
      categoryId: parseInt(data.categoryId),
      applicationId: parseInt(data.applicationId),
      url: data.url,
      params: [], // Se completará después
      tags: tagsArray,
      organizationId: 0, // Se asignará en el componente padre
    };

    await onSubmit(templateData);
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    categories,
    applications,
    processSubmit,
  };
};

// Componentes atómicos
const TemplateNameField: React.FC<{
  register: ReturnType<typeof useForm<FormValues>>["register"];
  error?: { message?: string };
}> = ({ register, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Nombre
    </label>
    <Input
      {...register("name", { required: "El nombre es obligatorio" })}
      placeholder="Nombre del template"
      className={`w-full ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const TemplateDescriptionField: React.FC<{
  register: ReturnType<typeof useForm<FormValues>>["register"];
  error?: { message?: string };
}> = ({ register, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Descripción
    </label>
    <TextArea
      register={register("description", {
        required: "La descripción es obligatoria",
      })}
      placeholder="Describe tu template"
      className={`w-full ${error ? "border-red-500" : ""}`}
      rows={4}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const TemplateImageUploader: React.FC<{
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}> = ({ handleImageChange, previewImage }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      Imagen (opcional)
    </label>
    <div className="flex items-center space-x-4">
      {previewImage && (
        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
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
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500"
      />
    </div>
  </div>
);

const TemplateModalActions: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => (
  <div className="flex justify-end space-x-3">
    <Button variant="default" onClick={onClose}>
      Cancelar
    </Button>
    <Button type="submit" variant="primary">
      Guardar
    </Button>
  </div>
);

// Componente principal del modal
const FunctionTemplateModal: React.FC<FunctionTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { previewImage, handleImageChange } = useImageUpload();
  const {
    register,
    handleSubmit,
    control,
    errors,
    categories,
    applications,
    processSubmit,
  } = useTemplateForm(onSubmit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Editar" : "Crear"} Template de Función
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(processSubmit)} className="p-6">
          <TemplateNameField register={register} error={errors.name} />
          <TemplateDescriptionField
            register={register}
            error={errors.description}
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Categoría
              </label>
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: "Selecciona una categoría" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(category => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Aplicación
              </label>
              <Controller
                control={control}
                name="applicationId"
                rules={{ required: "Selecciona una aplicación" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full flex px-3 py-4 items-center gap-[11px] bg-[#FCFCFC] self-stretch rounded-[4px] border border-sofia-darkBlue text-sofia-superDark text-[14px] font-normal leading-normal"
                  >
                    <option value="">Seleccionar...</option>
                    {applications.map(app => (
                      <option key={app.id} value={String(app.id)}>
                        {app.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.applicationId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.applicationId.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              URL del Endpoint
            </label>
            <Input
              register={register("url", { required: "La URL es obligatoria" })}
              placeholder="https://api.example.com/endpoint"
              className={`w-full ${errors.url ? "border-red-500" : ""}`}
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tags (separados por comas)
            </label>
            <Input
              register={register("tags")}
              placeholder="tag1, tag2, tag3"
              className={`w-full ${errors.tags ? "border-red-500" : ""}`}
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
            )}
          </div>

          <TemplateImageUploader
            handleImageChange={handleImageChange}
            previewImage={previewImage}
          />

          <TemplateModalActions onClose={onClose} />
        </form>
      </div>
    </div>
  );
};

export default FunctionTemplateModal;
