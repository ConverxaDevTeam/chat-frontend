import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { getMyOrganizationsAsync, logOutAsync } from "@store/actions/auth";
import ConfigPanel from "@components/ConfigPanel";
import { Button } from "@components/common/Button";
import RawModal from "@components/RawModal";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

// Import step components
import OrganizationStep from "./steps/OrganizationStep";
import DepartmentStep from "./steps/DepartmentStep";
import AgentStep from "./steps/AgentStep";
import KnowledgeStep from "./steps/KnowledgeStep";
import ChatConfigStep from "./steps/ChatConfigStep";
import InterfaceStep from "./steps/InterfaceStep";
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
  const { myOrganizations } = useSelector((state: RootState) => state.auth);

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
    interface: {
      primaryColor: "#10B981",
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      buttonStyle: "rounded",
      position: "bottom-right",
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
    savedState,
  } = useSetupWizard();

  // Determine initial step based on saved state or existing data
  const getInitialStep = (): SetupStepId => {
    // If we have saved state, continue from there
    if (savedState?.currentStep) {
      return savedState.currentStep as SetupStepId;
    }
    // If user already has organizations, start from department
    if (myOrganizations && myOrganizations.length > 0) {
      return "department";
    }
    return "organization";
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

  // Track completed steps
  const completedSteps = useMemo(() => {
    const completed: SetupStepId[] = [];

    // Add logic to determine which steps are completed
    if (organizationId) completed.push("organization");
    if (departmentId) completed.push("department");
    if (agentId) completed.push("agent");

    // Knowledge is optional, so we consider it completed if we've moved past it
    const currentIndex = [
      "organization",
      "department",
      "agent",
      "knowledge",
      "chat",
      "interface",
      "integration",
      "final",
    ].indexOf(activeTab);
    if (currentIndex > 3) completed.push("knowledge");

    // Add other completed steps based on form data and progress
    if (formData.chatConfig.title && currentIndex > 4) completed.push("chat");
    if (formData.interface.primaryColor && currentIndex > 5)
      completed.push("interface");
    if (integrationId && currentIndex > 6) completed.push("integration");

    return completed;
  }, [
    organizationId,
    departmentId,
    agentId,
    integrationId,
    formData,
    activeTab,
  ]);

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
          // Update saved state with current step
          const currentSavedState = localStorage.getItem("wizardState");
          const currentParsedState = currentSavedState
            ? JSON.parse(currentSavedState)
            : {};

          const newState = {
            ...currentParsedState,
            currentStep: tabs[currentStepIndex + 1].id,
            lastUpdated: new Date().toISOString(),
          };

          localStorage.setItem("wizardState", JSON.stringify(newState));
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
      clearWizardState(); // Clear saved wizard state
      await dispatch(logOutAsync());
      onClose();
    }
  };

  const renderStepContent = () => {
    const commonProps = {
      data: formData,
      updateData: updateFormData,
      organizationId,
      departmentId,
      agentId,
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
      case "interface":
        return <InterfaceStep {...commonProps} />;
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
            {renderStepContent()}
          </Fragment>
        </ConfigPanel>
      </div>
    </RawModal>
  );
};

export default InitialSetupWizard;
