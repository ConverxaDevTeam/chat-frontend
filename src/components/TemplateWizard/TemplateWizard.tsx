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
import { functionsService } from "@services/functions.service";
import { paramsService } from "@services/params.service"; // Importar paramsService

// Importaciones de archivos locales
import { useTabNavigation, useAuthenticators } from "./hooks";
import { ActionButtons, FunctionContent, ParamsContent } from "./components";
import { TemplateWizardProps, WizardFormValues } from "./types";
import {
  BodyType,
  FunctionNodeTypes,
  HttpMethod,
} from "@interfaces/functions.interface";
import { useAppSelector } from "@store/hooks";
import { BaseParamProperty } from "@interfaces/function-params.interface";

export const TemplateWizard = ({
  isOpen,
  onClose,
  templateId,
  agentId,
}: TemplateWizardProps) => {
  const [template, setTemplate] = useState<FunctionTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID de la organización desde Redux
  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );
  if (!organizationId) {
    throw new Error("No se encontró el ID de la organización");
  }
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
            console.log("WIZARD - Template recibido:", template);
            console.log("WIZARD - Estructura de params:", template.params);
            console.log("WIZARD - Tipo de params:", typeof template.params);
            setTemplate(template);

            // Establecer el dominio personalizado si existe
            if (template.application?.isDynamicDomain) {
              setValue("customDomain", template.application.domain || "");
            }

            // Transformar los parámetros de objeto a array
            const paramsArray =
              template.params && typeof template.params === "object"
                ? Object.entries(template.params).map(([id, param]) => ({
                    id,
                    name: param.name || id,
                    title: param.title || param.name || id,
                    description: param.description || "",
                    type: param.type || "string",
                    required: param.required || false,
                    enabled: param.required || false,
                    value: param.value || "",
                    properties: param.properties || [],
                  }))
                : [];

            console.log("WIZARD - Parámetros transformados:", paramsArray);

            reset({
              params: paramsArray,
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
  const createFunction = (formData: WizardFormValues) => {
    let finalUrl = template?.url ?? "";
    if (template?.application?.isDynamicDomain && formData.customDomain) {
      try {
        const urlObj = new URL(template.url);
        urlObj.hostname = formData.customDomain;
        finalUrl = urlObj.toString();
      } catch {
        // Si falla la construcción de URL, usar el valor original
        finalUrl = template.url;
      }
    }

    return {
      name: template?.name ?? "",
      agentId: agentId,
      description: template?.description ?? "",
      type: FunctionNodeTypes.API_ENDPOINT,
      config: {
        url: finalUrl,
        method: (template?.method as HttpMethod) ?? HttpMethod.POST,
        bodyType: (template?.bodyType as BodyType) ?? BodyType.JSON,
      },
    };
  };

  // Manejar el envío del formulario
  const onSave = async () => {
    try {
      console.log("Form values:", getValues());
      const formData = getValues();
      const functionData = createFunction(formData);
      const createdFunction = await functionsService.create(functionData);

      if (!createdFunction.id) {
        throw new Error("No se pudo crear la función");
      }

      // Asignar autenticador si existe
      if (formData.authenticatorId) {
        await functionsService.assignAuthenticator(
          createdFunction.id,
          formData.authenticatorId
        );
      }

      // Crear parámetros habilitados
      const enabledParams = formData.params?.filter(p => p.enabled) || [];
      for (const param of enabledParams) {
        const propertiesArray = Array.isArray(param.properties)
          ? (param.properties as (BaseParamProperty & { enabled?: boolean })[])
          : param.properties
            ? (Object.values(param.properties) as (BaseParamProperty & {
                enabled?: boolean;
              })[])
            : [];

        const paramDto = {
          name: param.name || param.title,
          title: param.title,
          description: param.value
            ? `este parametro siempre es ${param.value}`
            : param.description,
          type: param.type,
          required: param.required,
          value: param.value,
          properties: propertiesArray
            .filter(
              (p: BaseParamProperty & { enabled?: boolean }) =>
                p.enabled !== false
            )
            .map(
              (
                p: BaseParamProperty & { enabled?: boolean; value?: string }
              ) => ({
                name: p.name,
                type: p.type,
                value: p.value,
                description: p.value
                  ? `este parametro siempre es ${p.value}`
                  : p.description,
                required: p.required,
              })
            ),
        };

        await paramsService.create(paramDto, createdFunction.id);
      }

      toast.success("Función creada con parámetros configurados");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al crear función");
      } else {
        toast.error("Error desconocido al crear función");
      }
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
