import { useState, useEffect } from "react";
import Modal from "@components/Modal";
import ConfigPanel from "@components/ConfigPanel";
import { FunctionTemplate } from "@interfaces/template.interface";
import { getTemplateById } from "@services/template.service";
import { useForm, FormProvider } from "react-hook-form";
import Loading from "@components/Loading";
import { toast } from "react-toastify";
import AuthenticatorFormModal from "@components/Diagrams/authComponents/AuthenticatorFormModal";
import { authenticatorService } from "@services/authenticator.service";
import { functionsService } from "@services/functions.service"; // Importar el servicio de funciones
import { useAppSelector } from "@store/hooks"; // Importar el hook de Redux

// Importaciones de archivos locales
import { useTabNavigation, useAuthenticators } from "./hooks";
import { ActionButtons, FunctionContent, ParamsContent } from "./components";
import { TemplateWizardProps, WizardFormValues } from "./types";
import {
  BodyType,
  FunctionNodeTypes,
  HttpMethod,
} from "@interfaces/functions.interface";

export const TemplateWizard = ({
  isOpen,
  onClose,
  templateId,
}: TemplateWizardProps) => {
  const [template, setTemplate] = useState<FunctionTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID del agente desde Redux
  const agentId = useAppSelector(state => state.chat.currentAgent?.id || -1);
  // Obtener el ID de la organización desde Redux
  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );

  const {
    authenticators,
    fetchAuthenticators,
    showAuthModal,
    setShowAuthModal,
  } = useAuthenticators(organizationId || agentId); // Usar agentId como fallback

  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  } = useTabNavigation("function");

  const methods = useForm<WizardFormValues>({
    defaultValues: {
      params: [],
      authenticatorId: template?.authenticator?.id,
      customDomain: template?.application?.domain || "",
    },
  });

  const { setValue, watch, reset, getValues } = methods;

  // Cargar datos del template
  useEffect(() => {
    if (isOpen && templateId) {
      setLoading(true);
      getTemplateById(templateId)
        .then(template => {
          if (template) {
            setTemplate(template);

            // Establecer el dominio personalizado si existe
            if (template.application?.isDynamicDomain) {
              setValue("customDomain", template.application.domain || "");
            }

            reset({
              params: template.params.map(p => ({
                ...p,
                enabled: p.required ?? false,
                value: "",
              })),
              authenticatorId: template.authenticatorId,
              customDomain: template.application?.domain || "",
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

  // Manejar el cambio de dominio personalizado
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDomain = e.target.value;
    setValue("customDomain", newDomain);
  };

  // Crear función
  const createFunction = (formData: WizardFormValues) => ({
    name: template?.name ?? "",
    agentId: agentId, // Usar el ID del agente desde Redux
    description: template?.description ?? "",
    type: FunctionNodeTypes.API_ENDPOINT,
    config: {
      url: formData.customDomain ?? "",
      method: template?.method ?? HttpMethod.POST,
      bodyType: template?.bodyType ?? BodyType.JSON,
    },
  });

  // Manejar el envío del formulario
  const onSave = async () => {
    try {
      console.log("Form values:", getValues());
      await functionsService.create(createFunction(getValues()));
      toast.success("Función creada");
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al crear función");
    }
  };

  if (!isOpen) return null;

  return (
    <FormProvider {...methods}>
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
                    onDomainChange={handleDomainChange}
                  />
                )}
                {activeTab === "params" && (
                  <ParamsContent params={watch("params")} />
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
          organizationId={organizationId || agentId}
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
    </FormProvider>
  );
};
