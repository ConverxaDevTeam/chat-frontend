import React, { useCallback, useEffect, useState } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import { FormValues } from "./FunctionTemplateHooks";
import InfoTooltip from "@components/Common/InfoTooltip";
import * as templateService from "@services/template.service";
import {
  FunctionTemplateCategory,
  FunctionTemplateApplication,
} from "@interfaces/template.interface";
import {
  TemplateUrlField,
  TemplateSelectField,
  TemplateTagsField,
  TemplateNameField,
  TemplateDescriptionField,
} from "./FunctionTemplateBasicComponents";
import {
  CategoryModal,
  ApplicationModal,
} from "./FunctionTemplateModalComponents";
import { ParamsContent } from "./FunctionTemplateParamComponents";

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
  categoryOptions: initialCategoryOptions = [],
  applicationOptions: initialApplicationOptions = [],
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ value: string; label: string }>
  >(initialCategoryOptions);
  const [applicationOptions, setApplicationOptions] = useState<
    Array<{ value: string; label: string }>
  >(initialApplicationOptions);

  const loadCategories = useCallback(async () => {
    const categories = await templateService.getCategories();
    setCategoryOptions(
      categories.map(category => ({
        value: String(category.id),
        label: category.name,
      }))
    );
  }, []);

  const loadApplications = useCallback(async () => {
    const applications = await templateService.getApplications();
    setApplicationOptions(
      applications.map(application => ({
        value: String(application.id),
        label: application.name,
      }))
    );
  }, []);

  useEffect(() => {
    loadCategories();
    loadApplications();
  }, [loadCategories, loadApplications]);

  const handleCategorySave = async (
    category: Omit<FunctionTemplateCategory, "id">
  ) => {
    await templateService.createCategory(category);
    await loadCategories();
    setIsCategoryModalOpen(false);
  };

  const handleApplicationSave = async (
    application: Omit<FunctionTemplateApplication, "id">,
    imageFile: File
  ) => {
    await templateService.createApplication(application, imageFile);
    await loadApplications();
    setIsApplicationModalOpen(false);
  };

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Categoría</h3>
            <button
              type="button"
              className="text-primary-500 hover:text-primary-600"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <img
                src="/mvp/plus.svg"
                alt="Agregar categoría"
                className="w-5 h-5"
              />
            </button>
          </div>
          <TemplateSelectField
            control={control}
            name="categoryId"
            label=""
            options={categoryOptions}
            placeholder="Selecciona una categoría"
            onMenuOpen={loadCategories}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Aplicación</h3>
            <button
              type="button"
              className="text-primary-500 hover:text-primary-600"
              onClick={() => setIsApplicationModalOpen(true)}
            >
              <img
                src="/mvp/plus.svg"
                alt="Agregar aplicación"
                className="w-5 h-5"
              />
            </button>
          </div>
          <TemplateSelectField
            control={control}
            name="applicationId"
            label=""
            options={applicationOptions}
            placeholder="Selecciona una aplicación"
            onMenuOpen={loadApplications}
          />
        </div>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCategorySave}
      />

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSave={handleApplicationSave}
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
          register={register}
          control={control}
          categoryOptions={categoryOptions}
          applicationOptions={applicationOptions}
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
