import React from "react";
import { UseFormRegister, Control } from "react-hook-form";
import InfoTooltip from "@components/Common/InfoTooltip";
import { FormValues } from "./FunctionTemplateHooks";
import {
  TemplateNameField,
  TemplateDescriptionField,
  TemplateSelectField,
  TemplateUrlField,
  TemplateTagsField,
  TemplateImageUploader,
  ParamsContent,
} from "./FunctionTemplateComponents";

interface ConfigContentProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
}

interface BasicInfoContentProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  applicationOptions: Array<{ value: string; label: string }>;
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TabContentProps {
  activeTab: string;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  applicationOptions: Array<{ value: string; label: string }>;
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ConfigContent: React.FC<ConfigContentProps> = ({
  register,
  control,
}) => (
  <div className="space-y-6 py-4">
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      Configuración del endpoint
    </h3>
    <TemplateUrlField
      register={register}
      tooltip={
        <InfoTooltip
          text="Dirección web completa del servicio al que se conectará la función. Debe incluir http:// o https:// al inicio."
          width="220px"
        />
      }
      helpText="Introduce la URL completa del endpoint que utilizará esta función, para parametros en la url agregar :<nombre del parametro>. Para dominio dinamico escribir :Dominio/ en lugar del dominio"
    />
    <TemplateSelectField
      control={control}
      name="method"
      label="Método HTTP"
      options={[
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" },
      ]}
      placeholder="Seleccionar método"
      tooltip={
        <InfoTooltip
          text="GET: Para obtener datos. POST: Para enviar datos. PUT: Para actualizar recursos. DELETE: Para eliminar recursos."
          width="220px"
        />
      }
      helpText="Selecciona cómo la función se comunicará con la URL. Usa GET para leer datos y POST para enviarlos"
    />
    <TemplateSelectField
      control={control}
      name="bodyType"
      label="Tipo de Body"
      options={[
        { value: "JSON", label: "JSON" },
        { value: "FORM_DATA", label: "Form Data" },
      ]}
      placeholder="Seleccionar tipo de body"
      tooltip={
        <InfoTooltip
          text="JSON: Para enviar datos estructurados en formato JSON. Form Data: Para enviar datos como un formulario, útil para archivos."
          width="220px"
        />
      }
    />
    <TemplateTagsField
      register={register}
      tooltip={
        <InfoTooltip
          text="Etiquetas para categorizar y facilitar la búsqueda de esta función"
          width="220px"
        />
      }
      helpText="Añade etiquetas separadas por comas para facilitar la búsqueda"
    />
  </div>
);

export const BasicInfoContent: React.FC<BasicInfoContentProps> = ({
  register,
  control,
  categoryOptions,
  applicationOptions,
  previewImage,
  onImageChange,
}) => (
  <div className="space-y-6 py-4 w-[450px]">
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      Datos principales
    </h3>
    <TemplateNameField
      register={register}
      tooltip={<InfoTooltip text="Nombre identificativo de la función" />}
      helpText="Introduce un nombre descriptivo para identificar esta función"
    />
    <TemplateDescriptionField
      register={register}
      tooltip={
        <InfoTooltip text="Descripción detallada de la función y su propósito" />
      }
      helpText="Describe el propósito y funcionamiento de esta función"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TemplateSelectField
        control={control}
        name="categoryId"
        label="Categoría"
        options={categoryOptions}
        placeholder="Seleccionar categoría"
        tooltip={
          <InfoTooltip text="Categoría a la que pertenece esta función" />
        }
      />
      <TemplateSelectField
        control={control}
        name="applicationId"
        label="Aplicación"
        options={applicationOptions}
        placeholder="Seleccionar aplicación"
        tooltip={<InfoTooltip text="Aplicación que utilizará esta función" />}
      />
    </div>
    <TemplateImageUploader
      previewImage={previewImage}
      onImageChange={onImageChange}
      tooltip={
        <InfoTooltip text="Imagen representativa de la función (opcional)" />
      }
      helpText="Añade una imagen que represente visualmente esta función"
    />
  </div>
);

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  register,
  control,
  categoryOptions,
  applicationOptions,
  previewImage,
  onImageChange,
}) => {
  switch (activeTab) {
    case "info":
      return (
        <BasicInfoContent
          {...{
            register,
            control,
            categoryOptions,
            applicationOptions,
            previewImage,
            onImageChange,
          }}
        />
      );
    case "config":
      return <ConfigContent register={register} control={control} />;
    case "params":
      return <ParamsContent control={control} />;
    default:
      return null;
  }
};
