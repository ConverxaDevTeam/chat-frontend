import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { getMyOrganizationsAsync, logOutAsync } from "@store/actions/auth";
import { useCallback } from "react";
import ConfigPanel from "@components/ConfigPanel";
import { Button } from "@components/common/Button";
import RawModal from "@components/RawModal";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { useWizardStatus } from "@hooks/wizard/useWizardStatus";
import { WizardStatus } from "@utils/interfaces";
import { updateWizardStatus as updateWizardStatusBackend } from "@services/wizardStatus";
import { updateWizardStatus } from "@store/reducers/auth";

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
  onComplete,
}) => {
  const navigate = useNavigate();
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
    chatConfig: {
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

  // State para guardar el agentId cuando se auto-crea
  const [createdAgentId, setCreatedAgentId] = useState<number | null>(null);

  // Handle resource creation callback
  const handleResourceCreated = useCallback(
    async (type: string, id: number) => {
      console.log("🔥 handleResourceCreated called:", { type, id });
      console.log("🔥 Current wizardStatus:", wizardStatus);

      // Actualizar wizardStatus según el tipo de recurso creado
      let nextStatus: WizardStatus;
      let targetOrganizationId: number;

      switch (type) {
        case "organization":
          nextStatus = "department";
          targetOrganizationId = id; // Usar el ID de la organización recién creada
          console.log(
            "🔥 Organization created, setting status to:",
            nextStatus
          );
          break;
        case "department":
          nextStatus = "agent";
          targetOrganizationId = wizardStatus.organizationId!;
          console.log("🔥 Department created, setting status to:", nextStatus);
          break;
        case "agent":
          nextStatus = "chatConfig";
          targetOrganizationId = wizardStatus.organizationId!;
          setCreatedAgentId(id);
          console.log("🔥 Agent created, setting status to:", nextStatus);
          break;
        default:
          console.log("🔥 Unknown type, returning");
          return;
      }

      console.log("🔥 About to update wizard status in backend:", {
        organizationId: targetOrganizationId,
        wizardStatus: nextStatus,
      });

      // Actualizar en backend PRIMERO
      const backendSuccess = await updateWizardStatusBackend(
        targetOrganizationId,
        nextStatus
      );

      if (backendSuccess) {
        console.log("🔥 Backend wizard status updated successfully");

        // Luego actualizar Redux local
        dispatch(
          updateWizardStatus({
            organizationId: targetOrganizationId,
            wizardStatus: nextStatus,
          })
        );

        console.log("🔥 Redux wizard status updated");

        // Si se creó una organización, refrescar para sincronizar
        if (type === "organization") {
          console.log("🔥 Refreshing organizations...");
          await dispatch(getMyOrganizationsAsync());
          console.log("🔥 Organizations refreshed");
        }
      } else {
        console.log("🔥 Failed to update wizard status in backend");
      }
    },
    [dispatch, wizardStatus.organizationId]
  );

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
    null, // departmentId - será manejado por el backend
    createdAgentId, // agentId - usar el ID del agente auto-creado
    null, // integrationId - será manejado por el backend
    handleResourceCreated
  );

  // Determine initial step based on backend wizardStatus
  const getInitialStep = (): SetupStepId => {
    console.log("🔍 getInitialStep - wizardStatus:", wizardStatus);
    console.log("🔍 getInitialStep - currentStep:", wizardStatus.currentStep);
    console.log(
      "🔍 getInitialStep - shouldShowWizard:",
      wizardStatus.shouldShowWizard
    );

    // Si no debe mostrar wizard, ir a final
    if (!wizardStatus.shouldShowWizard) {
      console.log(
        "🔍 getInitialStep - No debe mostrar wizard, retornando final"
      );
      return "final";
    }

    // Mapear WizardStatus a SetupStepId
    const stepMapping: Record<WizardStatus, SetupStepId> = {
      organization: "organization",
      department: "department",
      agent: "agent",
      chatConfig: "chat",
      integration: "integration",
      complete: "final",
    };

    const result = stepMapping[wizardStatus.currentStep] || "organization";
    console.log("🔍 getInitialStep - Resultado final:", result);
    return result;
  };

  const initialStep = getInitialStep();
  console.log("🔍 InitialSetupWizard - initialStep calculado:", initialStep);

  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isLastTab,
    currentStepIndex,
  } = useTabNavigation(initialStep);

  console.log("🔍 InitialSetupWizard - activeTab actual:", activeTab);

  // Removed automatic tab switching - only change tabs via user interaction

  // Track completed steps basado en wizardStatus del backend
  const completedSteps = useMemo(() => {
    const completed: SetupStepId[] = [];

    // Determinar pasos completados basado en wizardStatus
    const stepOrder: WizardStatus[] = [
      "organization",
      "department",
      "agent",
      "chatConfig",
      "integration",
      "complete",
    ];

    const currentIndex = stepOrder.indexOf(wizardStatus.currentStep);

    // Todos los pasos anteriores están completados
    for (let i = 0; i < currentIndex; i++) {
      const step = stepOrder[i];
      const stepMapping: Record<WizardStatus, SetupStepId> = {
        organization: "organization",
        department: "department",
        agent: "agent",
        chatConfig: "chat",
        integration: "integration",
        complete: "final",
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
      const success = await processStep(activeTab, formData);

      if (success) {
        // Solo actualizar wizardStatus para pasos que no crean recursos
        // Los pasos que crean recursos ya actualizan via handleResourceCreated
        const stepsWithoutResourceCreation = [
          "knowledge",
          "chat",
          "integration",
        ];

        if (
          stepsWithoutResourceCreation.includes(activeTab) &&
          wizardStatus.organizationId
        ) {
          const nextStepMapping: Partial<Record<SetupStepId, WizardStatus>> = {
            knowledge: "chatConfig",
            chat: "integration",
            integration: "complete",
          };

          const nextStatus = nextStepMapping[activeTab];

          if (nextStatus) {
            dispatch(
              updateWizardStatus({
                organizationId: wizardStatus.organizationId,
                wizardStatus: nextStatus,
              })
            );
          }
        }

        if (isLastTab) {
          // Clear wizard state on completion
          clearWizardState();
          // Eliminar cualquier estado guardado del wizard anterior
          localStorage.removeItem("wizardState");
          if (onComplete) {
            onComplete();
          } else {
            navigate("/dashboard");
          }
          onClose();
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

  const renderStepContent = () => {
    const commonProps = {
      data: formData,
      updateData: updateFormData,
      organizationId: wizardStatus.organizationId || organizationId || null,
      departmentId: departmentId || null,
      agentId: agentId || null,
      integrationId,
      setIntegrationId,
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

      <Button
        onClick={handleNext}
        variant="primary"
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "Procesando..." : isLastTab ? "Finalizar" : "Siguiente"}
      </Button>
    </div>
  );

  if (!isOpen) return null;

  return (
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
  );
};

export default InitialSetupWizard;
