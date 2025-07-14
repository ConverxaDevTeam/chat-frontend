import { useWizardStepVerification } from "./wizard";

export const useInitialSetupRedirect = () => {
  const wizardVerification = useWizardStepVerification();

  const getRedirectPath = () => {
    return wizardVerification.shouldShowWizard
      ? "/initial-setup"
      : "/dashboard";
  };

  return {
    shouldShowWizard: wizardVerification.shouldShowWizard,
    redirectPath: getRedirectPath(),
    currentStep: wizardVerification.currentStep,
    isLoading: wizardVerification.isLoading,
    hasErrors: wizardVerification.hasErrors,
  };
};
