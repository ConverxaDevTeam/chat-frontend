import React from "react";
import { UseFormRegister, Control, FieldError } from "react-hook-form";
import { Input } from "@components/forms/input";
import { InputGroup } from "@components/forms/inputGroup";
import { Select } from "@components/forms/select";
import { Button } from "@components/common/Button";
import { TextArea } from "@components/forms/textArea";

import { FormValues } from "./FunctionTemplateHooks";

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
  onMenuOpen?: () => Promise<void> | void;
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

interface AddButtonProps {
  onClick: () => void;
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
  onMenuOpen,
}) => {
  // Implementar la lógica para manejar el evento onMenuOpen
  const handleFocus = () => {
    if (onMenuOpen) {
      onMenuOpen();
    }
  };

  return (
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
        onFocus={handleFocus}
      />
    </InputGroup>
  );
};

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

// Componente para botones de acción
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

// Componente para botón de agregar
export const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
  >
    <img src="/mvp/plus-circle.svg" alt="Agregar" className="w-5 h-5" />
  </button>
);
