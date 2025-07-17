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

    // Filter valid organizations (those with organization object not null)
    const validOrganizations =
      myOrganizations?.filter(org => org.organization !== null) || [];

    // Si no tiene organizaciones válidas, necesita crear una
    if (validOrganizations.length === 0) {
      return {
        shouldShowWizard: true,
        currentStep: "organization" as WizardStatus,
        organizationId: null,
        isLoading: false,
        hasMultipleOrganizations: false,
      };
    }

    // Si tiene múltiples organizaciones válidas, no mostrar wizard
    if (validOrganizations.length > 1) {
      return {
        shouldShowWizard: false,
        currentStep: "complete" as WizardStatus,
        organizationId: validOrganizations[0].organization.id,
        isLoading: false,
        hasMultipleOrganizations: true,
      };
    }

    // Una organización válida - usar wizardStatus del backend
    const currentOrganization = validOrganizations[0];

    const wizardStatus =
      currentOrganization.organization.wizardStatus || "organization";
    const organizationId = currentOrganization.organization.id;

    // Si el wizard está completo (link_web es el último paso), no mostrar
    const shouldShowWizard = wizardStatus !== "link_web";

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
