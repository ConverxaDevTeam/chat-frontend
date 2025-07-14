import { useState, useMemo, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { getMyOrganizationsAsync, logOutAsync } from "@store/actions/auth";
import ConfigPanel from "@components/ConfigPanel";
import { Button } from "@components/common/Button";
import RawModal from "@components/RawModal";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";
import { useWizardStepVerification, WizardStep } from "@hooks/wizard";

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

  // Usar verificación dinámica del wizard
  const wizardVerification = useWizardStepVerification();

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
  } = useSetupWizard();

  // Determine initial step based on dynamic verification
  const getInitialStep = (): SetupStepId => {
    // Si no debe mostrar wizard, ir a final
    if (!wizardVerification.shouldShowWizard) {
      return "final";
    }

    // Mapear WizardStep a SetupStepId
    const stepMapping: Record<WizardStep, SetupStepId> = {
      organization: "organization",
      department: "department",
      agent: "agent",
      knowledge: "knowledge",
      chatConfig: "chat",
      interface: "integration", // Mapear interface a integration por simplicidad
      integration: "integration",
      final: "final",
      complete: "final",
    };

    return stepMapping[wizardVerification.currentStep] || "organization";
  };

  const {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isLastTab,
    currentStepIndex,
  } = useTabNavigation(getInitialStep());

  // Actualizar tab activo cuando cambie la verificación
  useEffect(() => {
    if (wizardVerification.currentStep !== "complete") {
      const newStep = getInitialStep();
      if (newStep !== activeTab) {
        setActiveTab(newStep);
      }
    }
  }, [wizardVerification.currentStep, activeTab, setActiveTab]);

  // Track completed steps basado en verificación dinámica
  const completedSteps = useMemo(() => {
    const completed: SetupStepId[] = [];

    // Usar los estados de verificación dinámica
    wizardVerification.steps.forEach(stepStatus => {
      if (stepStatus.completed) {
        const stepMapping: Record<WizardStep, SetupStepId> = {
          organization: "organization",
          department: "department",
          agent: "agent",
          knowledge: "knowledge",
          chatConfig: "chat",
          interface: "integration",
          integration: "integration",
          final: "final",
          complete: "final",
        };
        const mappedStep = stepMapping[stepStatus.step];
        if (mappedStep && !completed.includes(mappedStep)) {
          completed.push(mappedStep);
        }
      }
    });

    // Ya no necesitamos lógica adicional - usamos solo la verificación dinámica

    return completed;
  }, [wizardVerification.steps, activeTab]);

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
        if (isLastTab) {
          // Clear wizard state on completion
          clearWizardState();
          // Eliminar cualquier estado guardado del wizard anterior
          localStorage.removeItem("wizardState");
          // Refresh organizations and redirect
          await dispatch(getMyOrganizationsAsync());
          if (onComplete) {
            onComplete();
          } else {
            navigate("/dashboard");
          }
          onClose();
        } else {
          goToNextTab();
          // Ya no necesitamos guardar estado en localStorage
          // La verificación dinámica maneja el estado
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
      organizationId: wizardVerification.organizationId || organizationId,
      departmentId: wizardVerification.departmentId || departmentId,
      agentId: wizardVerification.agentId || agentId,
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
            {(error || wizardVerification.hasErrors) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {error || "Error al cargar los datos del wizard"}
              </div>
            )}
            {wizardVerification.isLoading && (
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
