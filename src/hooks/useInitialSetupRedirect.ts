import { useWizardStatus } from "./wizard/useWizardStatus";

export const useInitialSetupRedirect = () => {
  const wizardStatus = useWizardStatus();

  const getRedirectPath = () => {
    return wizardStatus.shouldShowWizard ? "/initial-setup" : "/dashboard";
  };

  return {
    shouldShowWizard: wizardStatus.shouldShowWizard,
    redirectPath: getRedirectPath(),
    currentStep: wizardStatus.currentStep,
    isLoading: wizardStatus.isLoading,
    organizationId: wizardStatus.organizationId,
  };
};
