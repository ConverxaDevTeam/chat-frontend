import { useMemo } from "react";
import { useOrganizationVerification } from "./useOrganizationVerification";
import { useDepartmentVerification } from "./useDepartmentVerification";
import { useAgentVerification } from "./useAgentVerification";
import { useChatConfigVerification } from "./useChatConfigVerification";
import { useIntegrationVerification } from "./useIntegrationVerification";

export type WizardStep =
  | "organization"
  | "department"
  | "agent"
  | "knowledge"
  | "chatConfig"
  | "interface"
  | "integration"
  | "final"
  | "complete";

export interface WizardStepStatus {
  step: WizardStep;
  completed: boolean;
  required: boolean;
  loading?: boolean;
  error?: string | null;
}

export interface WizardVerificationResult {
  shouldShowWizard: boolean;
  currentStep: WizardStep;
  steps: WizardStepStatus[];
  organizationId: number | null;
  departmentId: number | null;
  agentId: number | null;
  integrationId: number | null;
  isLoading: boolean;
  hasErrors: boolean;
}

export const useWizardStepVerification = (): WizardVerificationResult => {
  // Solo verificar organización siempre
  const orgVerification = useOrganizationVerification();

  // Evaluación secuencial para evitar hooks innecesarios
  const evaluateCurrentStep = useMemo(() => {
    // Paso 1: Organización
    if (!orgVerification.hasOrganizations) {
      return {
        currentStep: "organization" as WizardStep,
        organizationId: null,
        departmentId: null,
        agentId: null,
        integrationId: null,
        shouldExecuteDept: false,
        shouldExecuteAgent: false,
        shouldExecuteChat: false,
        shouldExecuteIntegration: false,
      };
    }

    // Paso 2: Departamento - solo si ya tiene organización
    return {
      currentStep: "department" as WizardStep,
      organizationId: orgVerification.currentOrganization?.id || null,
      departmentId: null,
      agentId: null,
      integrationId: null,
      shouldExecuteDept: true,
      shouldExecuteAgent: false,
      shouldExecuteChat: false,
      shouldExecuteIntegration: false,
    };
  }, [orgVerification]);

  // Hooks condicionales basados en evaluación secuencial
  const deptVerification = useDepartmentVerification(
    evaluateCurrentStep.shouldExecuteDept
      ? evaluateCurrentStep.organizationId
      : undefined
  );

  // Reevaluación después del departamento
  const evaluateAfterDept = useMemo(() => {
    if (!evaluateCurrentStep.shouldExecuteDept) {
      return evaluateCurrentStep;
    }

    if (!deptVerification.hasDepartments) {
      return {
        ...evaluateCurrentStep,
        currentStep: "department" as WizardStep,
        departmentId: null,
      };
    }

    return {
      ...evaluateCurrentStep,
      currentStep: "agent" as WizardStep,
      departmentId: deptVerification.currentDepartment?.id || null,
      shouldExecuteAgent: true,
    };
  }, [evaluateCurrentStep, deptVerification]);

  const agentVerification = useAgentVerification(
    evaluateAfterDept.shouldExecuteAgent
      ? evaluateAfterDept.departmentId
      : undefined
  );

  // Reevaluación después del agente
  const evaluateAfterAgent = useMemo(() => {
    if (!evaluateAfterDept.shouldExecuteAgent) {
      return evaluateAfterDept;
    }

    if (!agentVerification.hasAgent) {
      return {
        ...evaluateAfterDept,
        currentStep: "agent" as WizardStep,
        agentId: null,
      };
    }

    return {
      ...evaluateAfterDept,
      currentStep: "chatConfig" as WizardStep,
      agentId: agentVerification.agentId,
      shouldExecuteChat: true,
    };
  }, [evaluateAfterDept, agentVerification]);

  const chatConfigVerification = useChatConfigVerification(
    evaluateAfterAgent.shouldExecuteChat
      ? evaluateAfterAgent.organizationId
      : undefined,
    evaluateAfterAgent.shouldExecuteChat
      ? evaluateAfterAgent.departmentId
      : undefined
  );

  // Reevaluación después del chat config
  const evaluateAfterChat = useMemo(() => {
    if (!evaluateAfterAgent.shouldExecuteChat) {
      return evaluateAfterAgent;
    }

    if (!chatConfigVerification.hasChatConfig) {
      return {
        ...evaluateAfterAgent,
        currentStep: "chatConfig" as WizardStep,
        integrationId: chatConfigVerification.integrationId,
      };
    }

    return {
      ...evaluateAfterAgent,
      currentStep: "integration" as WizardStep,
      integrationId: chatConfigVerification.integrationId,
      shouldExecuteIntegration: true,
    };
  }, [evaluateAfterAgent, chatConfigVerification]);

  const integrationVerification = useIntegrationVerification(
    evaluateAfterChat.shouldExecuteIntegration
      ? evaluateAfterChat.organizationId
      : undefined,
    evaluateAfterChat.shouldExecuteIntegration
      ? evaluateAfterChat.departmentId
      : undefined
  );

  // Evaluación final
  const finalEvaluation = useMemo(() => {
    if (!evaluateAfterChat.shouldExecuteIntegration) {
      return evaluateAfterChat;
    }

    if (!integrationVerification.hasIntegration) {
      return {
        ...evaluateAfterChat,
        currentStep: "integration" as WizardStep,
        integrationId: integrationVerification.integrationId,
      };
    }

    return {
      ...evaluateAfterChat,
      currentStep: "complete" as WizardStep,
      integrationId: integrationVerification.integrationId,
    };
  }, [evaluateAfterChat, integrationVerification]);

  const steps: WizardStepStatus[] = useMemo(() => {
    const stepsList: WizardStepStatus[] = [];

    // Siempre incluir organización
    stepsList.push({
      step: "organization",
      completed: orgVerification.hasOrganizations,
      required: !orgVerification.hasOrganizations,
    });

    // Solo incluir departamento si ya tiene organización
    if (evaluateCurrentStep.shouldExecuteDept) {
      stepsList.push({
        step: "department",
        completed: deptVerification.hasDepartments,
        required: !deptVerification.hasDepartments,
        loading: deptVerification.loading,
        error: deptVerification.error,
      });
    }

    // Solo incluir agente si ya tiene departamento
    if (evaluateAfterDept.shouldExecuteAgent) {
      stepsList.push({
        step: "agent",
        completed: agentVerification.hasAgent,
        required: !agentVerification.hasAgent,
        loading: agentVerification.loading,
        error: agentVerification.error,
      });
    }

    // Solo incluir chat config si ya tiene agente
    if (evaluateAfterAgent.shouldExecuteChat) {
      stepsList.push({
        step: "knowledge",
        completed: false,
        required: false,
      });

      stepsList.push({
        step: "chatConfig",
        completed: chatConfigVerification.hasChatConfig,
        required: !chatConfigVerification.hasChatConfig,
        loading: chatConfigVerification.loading,
        error: chatConfigVerification.error,
      });
    }

    // Solo incluir integración si ya tiene chat config
    if (evaluateAfterChat.shouldExecuteIntegration) {
      stepsList.push({
        step: "interface",
        completed: false,
        required: false,
      });

      stepsList.push({
        step: "integration",
        completed: integrationVerification.hasIntegration,
        required: !integrationVerification.hasIntegration,
        loading: integrationVerification.loading,
        error: integrationVerification.error,
      });
    }

    // Solo incluir final si está completo
    if (finalEvaluation.currentStep === "complete") {
      stepsList.push({
        step: "final",
        completed: false,
        required: true,
      });
    }

    return stepsList;
  }, [
    orgVerification,
    evaluateCurrentStep,
    deptVerification,
    evaluateAfterDept,
    agentVerification,
    evaluateAfterAgent,
    chatConfigVerification,
    evaluateAfterChat,
    integrationVerification,
    finalEvaluation,
  ]);

  const shouldShowWizard = useMemo(() => {
    // No mostrar wizard si debe saltarlo
    if (orgVerification.shouldSkipWizard) {
      return false;
    }

    // Mostrar wizard si hay pasos requeridos no completados
    return steps.some(step => step.required && !step.completed);
  }, [orgVerification.shouldSkipWizard, steps]);

  const currentStep: WizardStep = useMemo(() => {
    if (!shouldShowWizard) {
      return "complete";
    }

    // Encontrar el primer paso requerido no completado
    const nextRequiredStep = steps.find(
      step => step.required && !step.completed
    );
    return nextRequiredStep?.step || "complete";
  }, [shouldShowWizard, steps]);

  const isLoading = useMemo(() => {
    return steps.some(step => step.loading);
  }, [steps]);

  const hasErrors = useMemo(() => {
    return steps.some(step => step.error);
  }, [steps]);

  return {
    shouldShowWizard,
    currentStep: finalEvaluation.currentStep,
    steps,
    organizationId: finalEvaluation.organizationId,
    departmentId: finalEvaluation.departmentId,
    agentId: finalEvaluation.agentId,
    integrationId: finalEvaluation.integrationId,
    isLoading,
    hasErrors,
  };
};
