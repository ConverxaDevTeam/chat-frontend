import { useState, useEffect } from "react";
import Modal from "@components/Modal";
import ConfigPanel from "@components/ConfigPanel";
import { FunctionTemplate } from "@interfaces/template.interface";
import { getTemplateById } from "@services/template.service";
import { useForm } from "react-hook-form";
import { ParamType } from "@interfaces/function-params.interface";
import Loading from "@components/Loading";
import { toast } from "react-toastify";
import AuthenticatorFormModal from "@components/Diagrams/authComponents/AuthenticatorFormModal";
import { authenticatorService } from "@services/authenticator.service";

// Importaciones de archivos locales
import { useTabNavigation, useAuthenticators } from "./hooks";
import { ActionButtons, FunctionContent, ParamsContent } from "./components";
import {
  TemplateWizardProps,
  WizardFormValues,
  ParamConfigItem,
} from "./types";

export const TemplateWizard = ({
  isOpen,
  onClose,
  templateId,
}: TemplateWizardProps) => {
  const [template, setTemplate] = useState<FunctionTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID de la organización del template
  const organizationId = template?.applicationId || 1; // Valor por defecto temporal

  const {
    authenticators,
    fetchAuthenticators,
    showAuthModal,
    setShowAuthModal,
  } = useAuthenticators(organizationId);

  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  } = useTabNavigation("function");

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<WizardFormValues>({
      defaultValues: {
        params: {},
        authenticatorId: template?.authenticator?.id,
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

            reset({
              params: paramConfig,
              authenticatorId: template.authenticatorId,
            });

            // Cargar autenticadores
            fetchAuthenticators();
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
  }, [isOpen, templateId, reset, fetchAuthenticators]);

  // Manejar el envío del formulario
  const onSave = handleSubmit(data => {
    // Aquí se procesarían los datos del formulario para crear la función
    console.log("Datos del formulario:", data);
    onClose();
  });

  if (!isOpen) return null;

  return (
    <>
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
                {activeTab === "function" && (
                  <FunctionContent
                    template={template}
                    authenticators={authenticators}
                    selectedAuthenticatorId={watch("authenticatorId")}
                    onAuthenticatorChange={authId => {
                      setValue("authenticatorId", authId);
                      // No guardamos en el backend hasta el final
                    }}
                    onManageAuthenticators={() => setShowAuthModal(true)}
                  />
                )}
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
              <div className="text-gray-500 p-4">
                No se encontró el template
              </div>
            )}
          </ConfigPanel>
        </div>
      </Modal>

      {/* Modal para gestionar autenticadores */}
      {showAuthModal && (
        <AuthenticatorFormModal
          isShown={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          organizationId={organizationId}
          onSubmit={async data => {
            try {
              await authenticatorService.create(data);
              toast.success("Autenticador creado exitosamente");
              fetchAuthenticators();
              setShowAuthModal(false);
            } catch (error) {
              console.error("Error al crear autenticador:", error);
              toast.error("Error al crear el autenticador");
            }
          }}
          zindex={1100}
        />
      )}
    </>
  );
};
