import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { useMemo } from "react";
import { WizardStatus } from "@utils/interfaces";

export interface WizardStatusResult {
  shouldShowWizard: boolean;
  currentStep: WizardStatus;
  organizationId: number | null;
  isLoading: boolean;
  hasMultipleOrganizations: boolean;
}

export const useWizardStatus = (): WizardStatusResult => {
  const { user, myOrganizations, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const result = useMemo(() => {
    // Si está cargando, no mostrar wizard aún
    if (loading) {
      return {
        shouldShowWizard: false,
        currentStep: "organization" as WizardStatus,
        organizationId: null,
        isLoading: true,
        hasMultipleOrganizations: false,
      };
    }

    // Si es super admin, no mostrar wizard
    if (user?.is_super_admin) {
      return {
        shouldShowWizard: false,
        currentStep: "complete" as WizardStatus,
        organizationId: null,
        isLoading: false,
        hasMultipleOrganizations: false,
      };
    }

    // Si no tiene organizaciones, necesita crear una
    if (!myOrganizations || myOrganizations.length === 0) {
      return {
        shouldShowWizard: true,
        currentStep: "organization" as WizardStatus,
        organizationId: null,
        isLoading: false,
        hasMultipleOrganizations: false,
      };
    }

    // Si tiene múltiples organizaciones, no mostrar wizard
    if (myOrganizations.length > 1) {
      return {
        shouldShowWizard: false,
        currentStep: "complete" as WizardStatus,
        organizationId: myOrganizations[0].organization.id,
        isLoading: false,
        hasMultipleOrganizations: true,
      };
    }

    // Una organización - usar wizardStatus del backend
    const currentOrganization = myOrganizations[0];

    const wizardStatus =
      currentOrganization.organization.wizardStatus || "organization";
    const organizationId = currentOrganization.organization.id;

    // Si el wizard está completo (integration es el último paso), no mostrar
    const shouldShowWizard = wizardStatus !== "integration";

    return {
      shouldShowWizard,
      currentStep: wizardStatus,
      organizationId,
      isLoading: false,
      hasMultipleOrganizations: false,
    };
  }, [user, myOrganizations, loading]);

  return result;
};
