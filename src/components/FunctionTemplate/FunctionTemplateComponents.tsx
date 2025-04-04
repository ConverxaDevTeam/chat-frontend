import React, { useState } from "react";
import { UseFormRegister, Control, FieldError, useForm, useFieldArray } from "react-hook-form";
import { ParamType } from "@interfaces/function-params.interface";
import { 
  FunctionTemplateCategory, 
  FunctionTemplateApplication 
} from "@interfaces/template.interface";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";
import { TextArea } from "@components/forms/textArea";
import Modal from "@components/Modal";
import { toast } from "react-toastify";
import { createCategory, createApplication } from "@services/template.service";

import { FormValues } from "./FunctionTemplateHooks";
import { ParamEditorModal } from "./ParamEditorModal";

// Interfaces para componentes atómicos
interface TemplateNameFieldProps {
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  tooltip?: React.ReactNode;
  helpText?: React.ReactNode;
}

interface TemplateDescriptionFieldProps {
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  tooltip?: React.ReactNode;
  helpText?: React.ReactNode;
}

interface TemplateSelectFieldProps {
  control: Control<FormValues>;
  name: keyof FormValues;
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: FieldError;
  placeholder?: string;
  tooltip?: React.ReactNode;
  helpText?: React.ReactNode;
}

interface TemplateUrlFieldProps {
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  tooltip?: React.ReactNode;
  helpText?: React.ReactNode;
}

interface TemplateTagsFieldProps {
  register: UseFormRegister<FormValues>;
  tooltip?: React.ReactNode;
  helpText?: React.ReactNode;
}

interface TemplateImageUploaderProps {
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: React.ReactNode;
  helpText?: React.ReactNode;
}

interface ActionButtonsProps {
  isFirstTab: boolean;
  isLastTab: boolean;
  goToPreviousTab: () => void;
  goToNextTab: () => void;
  onSubmit: () => void;
}

interface ParamsContentProps {
  control: Control<FormValues>;
}

// Componentes atómicos
export const TemplateNameField: React.FC<TemplateNameFieldProps> = ({
  register,
  error,
  tooltip,
  helpText,
}) => (
  <InputGroup label="Nombre" errors={error} tooltip={tooltip}>
    {helpText && (
      <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2 mb-2">
        {helpText}
      </p>
    )}
    <Input
      {...register("name", { required: "El nombre es requerido" })}
      placeholder="Nombre de la plantilla"
      className="w-full"
    />
  </InputGroup>
);

export const TemplateDescriptionField: React.FC<
  TemplateDescriptionFieldProps
> = ({ register, error, tooltip, helpText }) => (
  <InputGroup label="Descripción" errors={error} tooltip={tooltip}>
    {helpText && (
      <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2 mb-2">
        {helpText}
      </p>
    )}
    <TextArea
      register={register("description", {
        required: "La descripción es requerida",
      })}
      placeholder="Descripción de la plantilla"
      className="w-full"
      rows={3}
    />
  </InputGroup>
);

export const TemplateSelectField: React.FC<TemplateSelectFieldProps> = ({
  control,
  name,
  label,
  options,
  error,
  placeholder,
  tooltip,
  helpText,
}) => (
  <InputGroup label={label} errors={error} tooltip={tooltip}>
    {helpText && (
      <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2 mb-2">
        {helpText}
      </p>
    )}
    <Select
      name={name}
      control={control}
      options={options}
      placeholder={placeholder}
    />
  </InputGroup>
);

export const TemplateUrlField: React.FC<TemplateUrlFieldProps> = ({
  register,
  error,
  tooltip,
  helpText,
}) => (
  <InputGroup label="URL del Endpoint" errors={error} tooltip={tooltip}>
    {helpText && (
      <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2 mb-2">
        {helpText}
      </p>
    )}
    <Input
      {...register("url", { required: "La URL es obligatoria" })}
      placeholder="https://api.example.com/endpoint"
      className="w-full"
    />
  </InputGroup>
);

export const TemplateTagsField: React.FC<TemplateTagsFieldProps> = ({
  register,
  tooltip,
  helpText,
}) => (
  <InputGroup label="Tags (separados por comas)" tooltip={tooltip}>
    {helpText && (
      <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2 mb-2">
        {helpText}
      </p>
    )}
    <Input
      {...register("tags")}
      placeholder="tag1, tag2, tag3"
      className="w-full"
    />
  </InputGroup>
);

export const TemplateImageUploader: React.FC<TemplateImageUploaderProps> = ({
  previewImage,
  onImageChange,
  tooltip,
  helpText,
}) => (
  <InputGroup label="Imagen (opcional)" tooltip={tooltip}>
    {helpText && (
      <p className="text-gray-700 text-[12px] font-[500] leading-[16px] -mt-2 mb-2">
        {helpText}
      </p>
    )}
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
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
    </div>
  </InputGroup>
);

export const ParamsContent: React.FC<ParamsContentProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "params",
  });
  const [editingParamIndex, setEditingParamIndex] = useState<number | null>(
    null
  );

  const addNewParam = () => {
    const name = `param_${fields.length + 1}`;
    const id = name.replace(/\s+/g, "-").toLowerCase();
    append({
      id,
      name,
      title: "",
      description: "",
      type: ParamType.STRING,
      required: false,
    });
    // Abrir el modal para editar el nuevo parámetro
    setEditingParamIndex(fields.length);
  };

  const handleCloseModal = () => {
    setEditingParamIndex(null);
  };

  return (
    <div className="py-4 w-[450px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Parámetros</h3>
        <button
          onClick={addNewParam}
          className="flex items-center text-sofia-primary hover:text-sofia-primary-dark transition-colors"
        >
          <img
            src="/mvp/circle-plus.svg"
            alt="Agregar"
            className="w-5 h-5 mr-1"
          />
          <span className="text-sm">Agregar parámetro</span>
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500 text-sm">
            No hay parámetros configurados
          </p>
          <button
            onClick={addNewParam}
            className="mt-2 text-sofia-primary hover:text-sofia-primary-dark text-sm font-medium"
          >
            Agregar el primer parámetro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 w-full">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-md p-3 flex justify-between items-center w-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex-grow overflow-hidden">
                <h4 className="font-medium truncate">{field.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Requerido
                    </span>
                  )}
                </div>
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {field.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => setEditingParamIndex(index)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  title="Editar parámetro"
                >
                  <img
                    src="/mvp/square-pen.svg"
                    alt="Editar"
                    className="w-4 h-4"
                  />
                </button>
                <button
                  onClick={() => remove(index)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  title="Eliminar parámetro"
                >
                  <img
                    src="/mvp/trash.svg"
                    alt="Eliminar"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingParamIndex !== null && (
        <ParamEditorModal
          isOpen={editingParamIndex !== null}
          onClose={handleCloseModal}
          onRemove={() => {
            remove(editingParamIndex);
            handleCloseModal();
          }}
          index={editingParamIndex as number}
          control={control}
        />
      )}
    </div>
  );
};

// Interfaces para modales de categoría y aplicación
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<FunctionTemplateCategory, "id">) => Promise<void>;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Omit<FunctionTemplateApplication, "id">) => Promise<void>;
}

interface AddButtonProps {
  onClick: () => void;
}

// Componentes para agregar categoría y aplicación
export const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
  >
    <img src="/mvp/plus-circle.svg" alt="Agregar" className="w-5 h-5" />
  </button>
);

// Modal para agregar categoría
export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<FunctionTemplateCategory, "id">>(
    {
      defaultValues: {
        name: "",
        description: "",
      },
    }
  );

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
          <Button variant="primary" type="submit">Guardar</Button>
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
export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<FunctionTemplateApplication, "id">>(
    {
      defaultValues: {
        name: "",
        description: "",
        image: "",
        domain: "",
        isDynamicDomain: false,
      },
    }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Omit<FunctionTemplateApplication, "id">) => {
    try {
      // Agregar la imagen al objeto si existe
      if (previewImage) {
        data.image = previewImage;
      }
      
      await onSave(data);
      reset();
      setPreviewImage(null);
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

        <InputGroup label="Imagen (recomendado)">
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
          <Button variant="primary" type="submit">Guardar</Button>
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

export const ActionButtons: React.FC<ActionButtonsProps> = ({
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
