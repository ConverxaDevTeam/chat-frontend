import { useState, useEffect } from "react";
import Modal from "@components/Modal";
import ConfigPanel from "@components/ConfigPanel";
import { FunctionTemplate } from "@interfaces/template.interface";
import { getTemplateById } from "@services/template.service";
import { useForm } from "react-hook-form";
import { ParamType } from "@interfaces/function-params.interface";
import Loading from "@components/Loading";

interface TemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;
}

interface ParamConfigItem {
  id: string;
  name: string;
  enabled: boolean;
  value: string;
  type: ParamType;
  required: boolean;
}

interface WizardFormValues {
  params: Record<string, ParamConfigItem>;
}

// Hook para gestionar la navegación por pestañas
const useTabNavigation = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabs = [
    {
      id: "function",
      label: "Función",
      icon: <img src="/mvp/settings.svg" className="w-5 h-5" />,
    },
    {
      id: "params",
      label: "Parámetros",
      icon: <img src="/mvp/list.svg" className="w-5 h-5" />,
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

// Componente para los botones de acción
const ActionButtons = ({
  onCancel,
  onSave,
  goToPreviousTab,
  goToNextTab,
  isFirstTab,
  isLastTab,
}: {
  onCancel: () => void;
  onSave: () => void;
  goToPreviousTab: () => void;
  goToNextTab: () => void;
  isFirstTab: boolean;
  isLastTab: boolean;
}) => (
  <>
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      Cancelar
    </button>
    {!isFirstTab && (
      <button
        type="button"
        onClick={goToPreviousTab}
        className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
      >
        Anterior
      </button>
    )}
    {!isLastTab ? (
      <button
        type="button"
        onClick={goToNextTab}
        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
      >
        Siguiente
      </button>
    ) : (
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
      >
        Guardar
      </button>
    )}
  </>
);

// Componente para mostrar la información de la función
const FunctionContent = ({ template }: { template: FunctionTemplate }) => (
  <div className="space-y-6 py-4">
    <div className="flex items-start gap-4">
      {template.application?.imageUrl && (
        <div className="flex-shrink-0">
          <img
            src={template.application.imageUrl}
            alt={template.application?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800">{template.name}</h3>
        <p className="text-gray-600 mt-1">{template.description}</p>
        
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="mt-6 space-y-4 border-t pt-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">Aplicación</h4>
        <p className="mt-1">
          {template.application?.name || "No especificada"}
        </p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
        <p className="mt-1">{template.category?.name || "No especificada"}</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500">Autenticación</h4>
        <p className="mt-1">{template.authenticator?.name || "No requiere autenticación"}</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500">URL</h4>
        <p className="mt-1 text-blue-600 break-all">{template.url}</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500">Método</h4>
        <p className="mt-1">{template.method}</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500">Tipo de Body</h4>
        <p className="mt-1">{template.bodyType}</p>
      </div>
      
      {template.authenticator && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Autenticador</h4>
          <p className="mt-1">{template.authenticator.name}</p>
        </div>
      )}
    </div>
  </div>
);

// Componente para configurar los parámetros
const ParamsContent = ({
  params,
  register,
  setValue,
  watch,
}: {
  params: Record<string, ParamConfigItem>;
  register: any;
  setValue: any;
  watch: any;
}) => {
  const watchedParams = watch("params");

  const handleToggleParam = (paramId: string, enabled: boolean) => {
    setValue(`params.${paramId}.enabled`, enabled);
  };

  const handleValueChange = (paramId: string, value: string) => {
    setValue(`params.${paramId}.value`, value);
    if (value) {
      setValue(`params.${paramId}.enabled`, true);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        Configuración de Parámetros
      </h3>
      
      <div className="space-y-4">
        {Object.keys(params).length === 0 ? (
          <p className="text-gray-500 italic">
            Esta función no tiene parámetros configurables.
          </p>
        ) : (
          Object.entries(params).map(([paramId, param]) => (
            <div key={paramId} className="border rounded-md p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-800">{param.name}</h4>
                  {param.required && (
                    <span className="text-xs text-red-500">*Requerido</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {param.type === ParamType.OBJECT
                      ? "Objeto"
                      : param.type === ParamType.STRING
                        ? "Texto"
                        : param.type === ParamType.NUMBER
                          ? "Número"
                          : "Booleano"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register(`params.${paramId}.enabled`)}
                      checked={watchedParams[paramId]?.enabled}
                      onChange={e =>
                        handleToggleParam(paramId, e.target.checked)
                      }
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              {param.type !== ParamType.OBJECT && (
                <div className="mt-2">
                  {param.type === ParamType.STRING ? (
                    <div className="flex flex-col mt-2">
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder={`Valor para ${param.name}`}
                        disabled={!watchedParams[paramId]?.enabled}
                        value={watchedParams[paramId]?.value || ""}
                        onChange={e => handleValueChange(paramId, e.target.value)}
                      />
                    </div>
                  ) : (
                    <input
                      type={
                        param.type === ParamType.NUMBER
                          ? "number"
                          : param.type === ParamType.BOOLEAN
                            ? "checkbox"
                            : "text"
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        !watchedParams[paramId]?.enabled ? "bg-gray-100" : ""
                      }`}
                      placeholder={`Valor para ${param.name}`}
                      disabled={!watchedParams[paramId]?.enabled}
                      value={watchedParams[paramId]?.value || ""}
                      onChange={e => handleValueChange(paramId, e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Componente principal del wizard
export const TemplateWizard = ({
  isOpen,
  onClose,
  templateId,
}: TemplateWizardProps) => {
  const [template, setTemplate] = useState<FunctionTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  } = useTabNavigation("function");

  const { register, handleSubmit, setValue, watch, reset } = useForm<WizardFormValues>({
    defaultValues: {
      params: {},
    },
  });

  // Cargar datos del template
  useEffect(() => {
    if (isOpen && templateId) {
      setLoading(true);
      getTemplateById(templateId)
        .then(template => {
          if (template) {
            setTemplate(template);
            
            // Inicializar los parámetros en el formulario
            const paramConfig: Record<string, ParamConfigItem> = {};
            if (template.params && template.params.length > 0) {
              template.params.forEach(param => {
                if (param.type !== ParamType.OBJECT) {
                  paramConfig[param.id] = {
                    id: param.id,
                    name: param.name,
                    enabled: param.required,
                    value: param.defaultValue?.toString() || "",
                    type: param.type,
                    required: param.required,
                  };
                }
              });
            }
            
            reset({ params: paramConfig });
          }
        })
        .catch(err => {
          console.error("Error al cargar el template:", err);
          setError("No se pudo cargar la información del template");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, templateId, reset]);

  // Manejar el envío del formulario
  const onSave = handleSubmit(data => {
    // Aquí se procesarían los datos del formulario para crear la función
    console.log("Datos del formulario:", data);
    onClose();
  });

  if (!isOpen) return null;

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <div className="text-xl font-semibold">
          {template ? `Configurar función: ${template.name}` : "Cargando..."}
        </div>
      }
      zindex={1000}
    >
      <div className="w-full">
        <ConfigPanel
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isLoading={loading}
          actions={
            <ActionButtons
              onCancel={onClose}
              onSave={onSave}
              goToPreviousTab={goToPreviousTab}
              goToNextTab={goToNextTab}
              isFirstTab={isFirstTab}
              isLastTab={isLastTab}
            />
          }
        >
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : template ? (
            <div className="w-full max-w-2xl mx-auto">
              {activeTab === "function" && <FunctionContent template={template} />}
              {activeTab === "params" && (
                <ParamsContent
                  params={watch("params")}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
              )}
            </div>
          ) : (
            <div className="text-gray-500 p-4">No se encontró el template</div>
          )}
        </ConfigPanel>
      </div>
    </Modal>
  );
};
