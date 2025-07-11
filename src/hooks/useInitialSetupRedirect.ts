import { useSelector } from "react-redux";
import { RootState } from "@store/index";

export const useInitialSetupRedirect = () => {
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  const shouldShowWizard = () => {
    // Don't show wizard for super admins
    if (user?.is_super_admin) {
      return false;
    }

    // Check if wizard was in progress
    const savedWizardState = localStorage.getItem("wizardState");

    // Show wizard if user has no organizations OR has incomplete wizard
    const hasNoOrganizations = !myOrganizations || myOrganizations.length === 0;
    const hasIncompleteWizard = savedWizardState !== null;

    return hasNoOrganizations || hasIncompleteWizard;
  };

  const getRedirectPath = () => {
    return shouldShowWizard() ? "/initial-setup" : "/dashboard";
  };

  return {
    shouldShowWizard: shouldShowWizard(),
    redirectPath: getRedirectPath(),
  };
};
