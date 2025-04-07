import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FunctionTemplateCategory,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { TextArea } from "@components/forms/textArea";
import { Button } from "@components/common/Button";
import Modal from "@components/Modal";
import { toast } from "react-toastify";

// Interfaces para modales de categoría y aplicación
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<FunctionTemplateCategory, "id">) => Promise<void>;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    application: Omit<FunctionTemplateApplication, "id">,
    imageFile: File
  ) => Promise<void>;
}

// Modal para agregar categoría
export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<FunctionTemplateCategory, "id">>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: Omit<FunctionTemplateCategory, "id">) => {
    try {
      await onSave(data);
      reset();
      onClose();
      toast.success("Categoría creada exitosamente");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      toast.error("Error al crear la categoría");
    }
  };

  const modalContent = (
    <div className="w-full p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup label="Nombre" errors={errors.name}>
          <Input
            {...register("name", { required: "El nombre es requerido" })}
            placeholder="Nombre de la categoría"
            className="w-full"
          />
        </InputGroup>

        <InputGroup label="Descripción" errors={errors.description}>
          <TextArea
            register={register("description")}
            placeholder="Descripción de la categoría"
            className="w-full"
            rows={3}
          />
        </InputGroup>

        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={<div>Crear nueva categoría</div>}
      zindex={1001}
    >
      {modalContent}
    </Modal>
  );
};

// Modal para agregar aplicación
export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<FunctionTemplateApplication, "id">>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      domain: "",
      isDynamicDomain: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Omit<FunctionTemplateApplication, "id">) => {
    try {
      // Validar que exista una imagen
      if (!imageFile) {
        setImageError("La imagen es requerida");
        return;
      }
      // Enviar los datos con el archivo de imagen
      await onSave(data, imageFile);
      // Resetear el formulario
      reset();
      setPreviewImage(null);
      setImageFile(null);
      setImageError(null);
      onClose();
      toast.success("Aplicación creada exitosamente");
    } catch (error) {
      console.error("Error al crear aplicación:", error);
      toast.error("Error al crear la aplicación");
    }
  };

  const modalContent = (
    <div className="w-full p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup label="Nombre" errors={errors.name}>
          <Input
            {...register("name", { required: "El nombre es requerido" })}
            placeholder="Nombre de la aplicación"
            className="w-full"
          />
        </InputGroup>

        <InputGroup label="Descripción" errors={errors.description}>
          <TextArea
            register={register("description")}
            placeholder="Descripción de la aplicación"
            className="w-full"
            rows={3}
          />
        </InputGroup>

        <InputGroup label="Dominio" errors={errors.domain}>
          <Input
            {...register("domain")}
            placeholder="example.com"
            className="w-full"
          />
        </InputGroup>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDynamicDomain"
            {...register("isDynamicDomain")}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <label htmlFor="isDynamicDomain" className="text-sm text-gray-700">
            Es un dominio dinámico
          </label>
        </div>

        <InputGroup
          label="Imagen"
          errors={imageError ? { message: imageError } : undefined}
        >
          <div className="flex items-center space-x-4">
            {previewImage && (
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                <img
                  src={previewImage}
                  alt="Vista previa"
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
        </InputGroup>

        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={<div>Crear nueva aplicación</div>}
      zindex={1001}
    >
      {modalContent}
    </Modal>
  );
};
