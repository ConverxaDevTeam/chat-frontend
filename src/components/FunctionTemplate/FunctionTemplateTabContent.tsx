import React, { useState } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import { FormValues } from "./FunctionTemplateHooks";
import InfoTooltip from "@components/Common/InfoTooltip";
import {
  TemplateNameField,
  TemplateDescriptionField,
  TemplateSelectField,
  TemplateUrlField,
  TemplateTagsField,
  ParamsContent,
  CategoryModal,
  ApplicationModal,
} from "./FunctionTemplateComponents";
import * as templateService from "@services/template.service";

interface ConfigContentProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
}

interface BasicInfoContentProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  applicationOptions: Array<{ value: string; label: string }>;
}

interface TabContentProps {
  activeTab: string;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  applicationOptions: Array<{ value: string; label: string }>;
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
  categoryOptions: initialCategoryOptions,
  applicationOptions: initialApplicationOptions,
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(
    initialCategoryOptions
  );
  const [applicationOptions, setApplicationOptions] = useState(
    initialApplicationOptions
  );

  return (
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
        <div className="flex items-center space-x-2">
          <div className="flex-1">
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
          </div>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <img
              src="/mvp/circle-plus.svg"
              alt="Añadir categoría"
              className="w-5 h-5"
            />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <TemplateSelectField
              control={control}
              name="applicationId"
              label="Aplicación"
              options={applicationOptions}
              placeholder="Seleccionar aplicación"
              tooltip={
                <InfoTooltip text="Aplicación que utilizará esta función" />
              }
            />
          </div>
          <button
            type="button"
            onClick={() => setIsApplicationModalOpen(true)}
            className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <img
              src="/mvp/circle-plus.svg"
              alt="Añadir aplicación"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={async category => {
          try {
            // Crear la categoría usando el servicio
            await templateService.createCategory(category);
            // Actualizar la lista de categorías
            const updatedCategories = await templateService.getCategories();
            const formattedCategories = updatedCategories.map(cat => ({
              value: cat.id.toString(),
              label: cat.name,
            }));
            setCategoryOptions(formattedCategories);
            // Cerrar el modal
            setIsCategoryModalOpen(false);
            return Promise.resolve();
          } catch (error) {
            console.error("Error al crear categoría:", error);
            return Promise.reject(error);
          }
        }}
      />

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSave={async application => {
          try {
            // Crear la aplicación usando el servicio
            await templateService.createApplication(application);
            // Actualizar la lista de aplicaciones
            const updatedApplications = await templateService.getApplications();
            const formattedApplications = updatedApplications.map(app => ({
              value: app.id.toString(),
              label: app.name,
            }));
            setApplicationOptions(formattedApplications);
            // Cerrar el modal
            setIsApplicationModalOpen(false);
            return Promise.resolve();
          } catch (error) {
            console.error("Error al crear aplicación:", error);
            return Promise.reject(error);
          }
        }}
      />
    </div>
  );
};

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  register,
  control,
  categoryOptions,
  applicationOptions,
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
