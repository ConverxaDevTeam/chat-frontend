import { useState, useMemo, Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { getMyOrganizationsAsync, logOutAsync } from "@store/actions/auth";
import { useCallback } from "react";
import ConfigPanel from "@components/ConfigPanel";
import { Button } from "@components/common/Button";
import RawModal from "@components/RawModal";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import ProtectedAuth from "@components/ProtectedAuth";
import { useWizardStatus } from "@hooks/wizard/useWizardStatus";
import { WizardStatus } from "@utils/interfaces";
import { updateWizardStatus as updateWizardStatusBackend } from "@services/wizardStatus";
import { updateWizardStatus } from "@store/reducers/auth";
import { getWorkspaceData, getDepartments } from "@services/department";

// Import step components
import OrganizationStep from "./steps/OrganizationStep";
import DepartmentStep from "./steps/DepartmentStep";
import AgentStep from "./steps/AgentStep";
import KnowledgeStep from "./steps/KnowledgeStep";
import ChatConfigStep from "./steps/ChatConfigStep";
import IntegrationStep from "./steps/IntegrationStep";
import FinalStep from "./steps/FinalStep";

// Import hooks and types
import { useSetupWizard } from "./hooks/useSetupWizard";
import { useTabNavigation } from "./hooks/useTabNavigation";
import { SetupFormData, SetupStepId } from "./types";

interface InitialSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const InitialSetupWizard: React.FC<InitialSetupWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Usar wizardStatus del backend
  const wizardStatus = useWizardStatus();

  const [formData, setFormData] = useState<SetupFormData>({
    organization: {
      name: "",
      description: "",
      logo: null,
    },
    department: {
      name: "",
      description: "",
    },
    agent: {
      id: undefined,
      name: "",
      instruction: "",
    },
    knowledge: {
      files: [],
      urls: [],
    },
    chat: {
      title: "Asistente Virtual",
      subtitle: "¿En qué puedo ayudarte?",
      description: "Estoy aquí para responder tus preguntas",
      welcomeMessage: "¡Hola! ¿En qué puedo ayudarte hoy?",
      placeholder: "Escribe tu mensaje...",
    },
    integration: {
      domains: [],
    },
  });

  // State para guardar el agentId cuando se auto-crea o se obtiene del departamento existente
  const [createdAgentId, setCreatedAgentId] = useState<number | null>(null);
  const [departmentAgentId, setDepartmentAgentId] = useState<number | null>(
    null
  );
  const [departmentIdFromBackend, setDepartmentIdFromBackend] = useState<
    number | null
  >(null);

  // Handle resource creation callback
  const handleResourceCreated = useCallback(
    async (type: string, id: number) => {
      // Actualizar wizardStatus según el tipo de recurso creado
      let nextStatus: WizardStatus;
      let targetOrganizationId: number;

      switch (type) {
        case "organization":
          nextStatus = "department";
          targetOrganizationId = id; // Usar el ID de la organización recién creada
          break;
        case "department":
          nextStatus = "agent";
          targetOrganizationId = wizardStatus.organizationId!;
          break;
        case "agent":
          nextStatus = "knowledge";
          targetOrganizationId = wizardStatus.organizationId!;
          setCreatedAgentId(id);
          break;
        default:
          return;
      }

      // Actualizar en backend PRIMERO
      const backendSuccess = await updateWizardStatusBackend(
        targetOrganizationId,
        nextStatus
      );

      if (backendSuccess) {
        // Luego actualizar Redux local
        dispatch(
          updateWizardStatus({
            organizationId: targetOrganizationId,
            wizardStatus: nextStatus,
          })
        );

        // Si se creó una organización, refrescar para sincronizar
        if (type === "organization") {
          await dispatch(getMyOrganizationsAsync());
        }
      }
    },
    [dispatch, wizardStatus.organizationId]
  );

  // Obtener departmentId y agentId del departamento existente cuando se inicializa el wizard
  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (
        wizardStatus.organizationId &&
        (wizardStatus.currentStep === "agent" ||
          wizardStatus.currentStep === "knowledge" ||
          wizardStatus.currentStep === "chat" ||
          wizardStatus.currentStep === "integration")
      ) {
        try {
          // Primero obtener los departamentos de la organización
          const departments = await getDepartments(wizardStatus.organizationId);
          if (departments && departments.length > 0) {
            const departmentId = departments[0].id;
            setDepartmentIdFromBackend(departmentId);

            // Luego obtener los datos del workspace con el departmentId
            const workspaceData = await getWorkspaceData(departmentId);
            if (workspaceData?.department?.agente?.id) {
              setDepartmentAgentId(workspaceData.department.agente.id);
            }
          }
        } catch (error) {
          console.error("Error obteniendo datos del workspace:", error);
        }
      }
    };

    fetchDepartmentData();
  }, [wizardStatus.organizationId, wizardStatus.currentStep]);

  const {
    isLoading,
    error,
    processStep,
    organizationId,
    departmentId,
    agentId,
    integrationId,
    setIntegrationId,
    clearWizardState,
  } = useSetupWizard(
    wizardStatus.organizationId,
    departmentIdFromBackend, // departmentId - usar el ID del departamento existente
    createdAgentId || departmentAgentId, // agentId - usar el ID del agente auto-creado o del departamento existente
    null, // integrationId - será manejado por el backend
    handleResourceCreated
  );

  // Determine initial step based on backend wizardStatus
  const getInitialStep = (): SetupStepId => {
    // Si no debe mostrar wizard, ir a final
    if (!wizardStatus.shouldShowWizard) {
      return "final";
    }

    // Mapear WizardStatus a SetupStepId
    const stepMapping: Record<WizardStatus, SetupStepId> = {
      organization: "organization",
      department: "department",
      agent: "agent",
      knowledge: "knowledge",
      chat: "chat",
      integration: "integration",
      link_web: "final",
    };

    return stepMapping[wizardStatus.currentStep] || "organization";
  };

  const initialStep = getInitialStep();

  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isLastTab,
    currentStepIndex,
  } = useTabNavigation(initialStep);

  // Removed automatic tab switching - only change tabs via user interaction

  // Track completed steps basado en wizardStatus del backend
  const completedSteps = useMemo(() => {
    const completed: SetupStepId[] = [];

    // Determinar pasos completados basado en wizardStatus
    const stepOrder: WizardStatus[] = [
      "organization",
      "department",
      "agent",
      "knowledge",
      "chat",
      "integration",
      "link_web",
    ];

    const currentIndex = stepOrder.indexOf(wizardStatus.currentStep);

    // Todos los pasos anteriores están completados
    for (let i = 0; i < currentIndex; i++) {
      const step = stepOrder[i];
      const stepMapping: Record<WizardStatus, SetupStepId> = {
        organization: "organization",
        department: "department",
        agent: "agent",
        knowledge: "knowledge",
        chat: "chat",
        integration: "integration",
        link_web: "final",
      };
      const mappedStep = stepMapping[step];
      if (mappedStep) {
        completed.push(mappedStep);
      }
    }

    return completed;
  }, [wizardStatus.currentStep, activeTab]);

  // Update tabs with completion status
  const tabsWithStatus = useMemo(() => {
    return tabs.map(tab => ({
      ...tab,
      status: completedSteps.includes(tab.id)
        ? ("completed" as const)
        : tab.id === activeTab
          ? ("current" as const)
          : ("pending" as const),
    }));
  }, [tabs, completedSteps, activeTab]);

  const { showConfirmation } = useAlertContext();

  const updateFormData = (
    section: keyof SetupFormData,
    data: Partial<SetupFormData[typeof section]>
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleNext = async () => {
    try {
      // Manejar integration step especialmente
      if (activeTab === "integration") {
        const success = await processStep(activeTab, formData);
        if (success) {
          // Solo ir al tab final, NO actualizar el estado del backend
          goToNextTab();
        }
        return;
      }

      // Para el paso de departamento, manejar la obtención del agente auto-creado
      if (activeTab === "department") {
        const success = await processStep(activeTab, formData);
        if (success) {
          // Después de crear el departamento, obtener el agente auto-creado
          try {
            const departments = await getDepartments(
              wizardStatus.organizationId!
            );
            if (departments && departments.length > 0) {
              const departmentId = departments[0].id;
              setDepartmentIdFromBackend(departmentId);

              const workspaceData = await getWorkspaceData(departmentId);
              if (workspaceData?.department?.agente?.id) {
                setDepartmentAgentId(workspaceData.department.agente.id);
              }
            }
          } catch (error) {
            console.error("Error obteniendo agente auto-creado:", error);
          }

          // Actualizar wizard status
          if (wizardStatus.organizationId) {
            const backendSuccess = await updateWizardStatusBackend(
              wizardStatus.organizationId,
              "agent"
            );

            if (backendSuccess) {
              dispatch(
                updateWizardStatus({
                  organizationId: wizardStatus.organizationId,
                  wizardStatus: "agent",
                })
              );
            }
          }

          goToNextTab();
        }
        return;
      }

      // Para el resto de pasos, procesar normalmente
      const success = await processStep(activeTab, formData);

      if (success) {
        // Actualizar wizardStatus para pasos que no son organization, department ni integration
        if (wizardStatus.organizationId) {
          const nextStepMapping: Record<SetupStepId, WizardStatus> = {
            organization: "department", // No se usa aquí, pero necesario para el tipo
            department: "agent", // No se usa aquí, pero necesario para el tipo
            agent: "knowledge",
            knowledge: "chat",
            chat: "integration",
            integration: "integration", // No se usa aquí, pero necesario para el tipo
            final: "link_web", // Solo actualizar a link_web cuando se haga clic en los botones finales
          };

          const nextStatus = nextStepMapping[activeTab];

          if (nextStatus && activeTab !== "final") {
            // Actualizar en backend PRIMERO
            const backendSuccess = await updateWizardStatusBackend(
              wizardStatus.organizationId,
              nextStatus
            );

            if (backendSuccess) {
              // Luego actualizar Redux local
              dispatch(
                updateWizardStatus({
                  organizationId: wizardStatus.organizationId,
                  wizardStatus: nextStatus,
                })
              );
            }
          }
        }

        if (isLastTab) {
          // En el último paso (final), no hacer nada automáticamente
          // Los botones en FinalStep manejarán la redirección
          if (activeTab === "final") {
            // No hacer nada aquí, los botones del FinalStep manejan las acciones
            return;
          } else {
            goToNextTab();
          }
        } else {
          goToNextTab();
        }
      }
    } catch (error) {
      console.error("Error in setup step:", error);
    }
  };

  const handleSkip = () => {
    if (!isLastTab) {
      goToNextTab();
    }
  };

  const handleCancel = async () => {
    const confirmed = await showConfirmation({
      title: "Cancelar configuración",
      text: "¿Estás seguro de que quieres cancelar la configuración? Se cerrará tu sesión.",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Continuar configurando",
    });

    if (confirmed) {
      clearWizardState();
      // Limpiar cualquier estado guardado del wizard anterior
      localStorage.removeItem("wizardState");
      await dispatch(logOutAsync());
      onClose();
    }
  };

  const handleWizardComplete = async () => {
    // Actualizar estado a link_web cuando se complete realmente
    if (wizardStatus.organizationId) {
      const backendSuccess = await updateWizardStatusBackend(
        wizardStatus.organizationId,
        "link_web"
      );

      if (backendSuccess) {
        dispatch(
          updateWizardStatus({
            organizationId: wizardStatus.organizationId,
            wizardStatus: "link_web",
          })
        );
      }
    }

    // Refrescar organizaciones para asegurar que estén actualizadas en FinalStep
    await dispatch(getMyOrganizationsAsync());

    // Clear wizard state on completion
    clearWizardState();
    // Eliminar cualquier estado guardado del wizard anterior
    localStorage.removeItem("wizardState");
    // NO hacer navegación automática - dejar que los botones manejen la navegación
  };

  const renderStepContent = () => {
    const commonProps = {
      data: formData,
      updateData: updateFormData,
      organizationId: wizardStatus.organizationId || organizationId || null,
      departmentId: departmentId || departmentIdFromBackend || null,
      agentId: agentId || createdAgentId || departmentAgentId || null,
      integrationId,
      setIntegrationId,
      onComplete: handleWizardComplete,
      onClose,
    };

    switch (activeTab) {
      case "organization":
        return <OrganizationStep {...commonProps} />;
      case "department":
        return <DepartmentStep {...commonProps} />;
      case "agent":
        return <AgentStep {...commonProps} />;
      case "knowledge":
        return <KnowledgeStep {...commonProps} />;
      case "chat":
        return <ChatConfigStep {...commonProps} />;
      case "integration":
        return <IntegrationStep {...commonProps} />;
      case "final":
        return <FinalStep {...commonProps} />;
      default:
        return null;
    }
  };

  const ActionButtons = () => (
    <div className="flex gap-3">
      {currentStepIndex === 0 ? (
        <Button onClick={handleCancel} variant="cancel" type="button">
          Cancelar
        </Button>
      ) : (
        <Button
          onClick={goToPreviousTab}
          variant="default"
          disabled={isLoading}
          type="button"
        >
          Anterior
        </Button>
      )}

      {activeTab === "knowledge" && (
        <Button
          onClick={handleSkip}
          variant="default"
          disabled={isLoading}
          type="button"
        >
          Omitir este paso
        </Button>
      )}

      {activeTab !== "final" && (
        <Button
          onClick={handleNext}
          variant="primary"
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "Procesando..." : "Siguiente"}
        </Button>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <ProtectedAuth>
      <RawModal isShown={isOpen} onClose={onClose}>
        <div className="w-[1180px] max-w-[95vw] sm:max-w-[90vw]">
          <ConfigPanel
            tabs={tabsWithStatus}
            activeTab={activeTab}
            onTabChange={tab => setActiveTab(tab as SetupStepId)}
            isLoading={isLoading}
            actions={<ActionButtons />}
            layout="wizard"
          >
            <Fragment>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                  {error}
                </div>
              )}
              {wizardStatus.isLoading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
                  Cargando datos del wizard...
                </div>
              )}
              {renderStepContent()}
            </Fragment>
          </ConfigPanel>
        </div>
      </RawModal>
    </ProtectedAuth>
  );
};

export default InitialSetupWizard;
