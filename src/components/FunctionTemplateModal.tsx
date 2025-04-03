import React, { useState, useEffect } from "react";
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

interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  applicationId: string;
  url: string;
  tags: string;
}

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
  // Estado para la imagen
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Estados para los datos del formulario
  const [categories, setCategories] = useState<FunctionTemplateCategory[]>([]);
  const [applications, setApplications] = useState<
    FunctionTemplateApplication[]
  >([]);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  // Cargar categorías y aplicaciones
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

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Procesar envío del formulario
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Editar" : "Crear"} Template de Función
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(processSubmit)} className="p-5">
          {/* Campo de nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nombre
            </label>
            <Input
              {...register("name", { required: "El nombre es obligatorio" })}
              placeholder="Nombre del template"
              className={`w-full ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Campo de descripción */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Descripción
            </label>
            <TextArea
              register={register("description", {
                required: "La descripción es obligatoria",
              })}
              placeholder="Describe tu template"
              className={`w-full ${errors.description ? "border-red-500" : ""}`}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Categoría y Aplicación */}
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
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

          {/* URL y Tags */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              URL del Endpoint
            </label>
            <Input
              {...register("url", { required: "La URL es obligatoria" })}
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
              {...register("tags")}
              placeholder="tag1, tag2, tag3"
              className="w-full"
            />
          </div>

          {/* Carga de imagen */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Imagen (opcional)
            </label>
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
                onChange={handleImageChange}
                className="text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FunctionTemplateModal;
