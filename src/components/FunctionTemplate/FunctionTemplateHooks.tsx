import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FunctionTemplate,
  FunctionTemplateCategory,
  FunctionTemplateApplication,
  FunctionTemplateParam,
} from "@interfaces/template.interface";
import { getApplications, getCategories } from "@services/template.service";
import { HttpMethod, BodyType } from "@interfaces/functions.interface";

export interface FormValues {
  name: string;
  description: string;
  categoryId: number | undefined;
  applicationId: number | undefined;
  tags: string[];
  authenticatorId?: number;
  url: string;
  method: HttpMethod;
  bodyType: BodyType;
  params: FunctionTemplateParam[];
}

// Custom hooks
export const useImageUpload = (isOpen: boolean, initialImage?: string) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Reiniciar la imagen cuando se cierra el modal o se carga una imagen inicial
  useEffect(() => {
    if (isOpen) {
      setPreviewImage(initialImage || null);
    } else {
      setPreviewImage(null);
    }
  }, [isOpen, initialImage]);

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

  return { previewImage, handleImageChange };
};

export const useTemplateData = (isOpen: boolean) => {
  const [categories, setCategories] = useState<FunctionTemplateCategory[]>([]);
  const [applications, setApplications] = useState<
    FunctionTemplateApplication[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [categoriesData, applicationsData] = await Promise.all([
            getCategories(),
            getApplications(),
          ]);
          setCategories(categoriesData);
          setApplications(applicationsData);
        } catch (error) {
          console.error("Error fetching template data:", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  return { categories, applications };
};

export const useSelectOptions = (
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

export const useTemplateForm = (
  onSubmit: (template: FunctionTemplate) => Promise<void>,
  isOpen: boolean,
  initialData?: FunctionTemplate
) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: undefined,
      applicationId: undefined,
      tags: [],
      url: "",
      method: HttpMethod.GET,
      bodyType: BodyType.JSON,
      params: [],
    },
  });

  // Reiniciar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Modo edición: cargar datos iniciales
        setValue("name", initialData.name);
        setValue("description", initialData.description);
        setValue("categoryId", initialData.categoryId);
        setValue("applicationId", initialData.applicationId);
        setValue("tags", initialData.tags || []);
        setValue("authenticatorId", initialData.authenticatorId);
        setValue("url", initialData.url);
        setValue("method", initialData.method || HttpMethod.GET);
        setValue("bodyType", initialData.bodyType || BodyType.JSON);
        setValue("params", initialData.params || []);
      } else {
        // Modo creación: reiniciar formulario
        reset({
          name: "",
          description: "",
          categoryId: undefined,
          applicationId: undefined,
          tags: [],
          url: "",
          params: [],
        });
      }
    }
  }, [isOpen, initialData, reset, setValue]);

  const processSubmit: SubmitHandler<FormValues> = async data => {
    try {
      // Procesar tags si es un string
      let processedTags = data.tags;
      if (typeof data.tags === "string") {
        // Convertir string separado por comas a array
        processedTags = (data.tags as unknown as string)
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      }

      // Asegurarse de que categoryId y applicationId sean números válidos
      const categoryId =
        data.categoryId !== undefined ? Number(data.categoryId) : 0;
      const applicationId =
        data.applicationId !== undefined ? Number(data.applicationId) : 0;

      // Si estamos editando, mantener el ID y otros campos
      const templateData: FunctionTemplate = {
        ...data,
        categoryId,
        applicationId,
        tags: processedTags as string[],
        id: initialData?.id || 0,
        method: data.method,
        bodyType: data.bodyType,
      };

      await onSubmit(templateData);
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };

  return { register, handleSubmit, control, errors, processSubmit };
};

export const useTabNavigation = (isOpen: boolean) => {
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
    {
      id: "params",
      label: "Parámetros",
      icon: <img src="/mvp/list.svg" className="w-5 h-5" />,
    },
  ];

  // Reiniciar a la primera pestaña cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab("info");
    }
  }, [isOpen]);

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
