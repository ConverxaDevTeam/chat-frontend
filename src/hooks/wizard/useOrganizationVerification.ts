import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { IOrganizarion } from "@utils/interfaces";

export interface OrganizationVerificationResult {
  hasOrganizations: boolean;
  hasMultipleOrganizations: boolean;
  needsOrganization: boolean;
  currentOrganization: IOrganizarion | null;
  shouldSkipWizard: boolean;
}

export const useOrganizationVerification =
  (): OrganizationVerificationResult => {
    const { myOrganizations, user } = useSelector(
      (state: RootState) => state.auth
    );

    const hasOrganizations = myOrganizations && myOrganizations.length > 0;
    const hasMultipleOrganizations =
      myOrganizations && myOrganizations.length > 1;
    const currentOrganization = hasOrganizations ? myOrganizations[0] : null;

    // Si es super admin, no necesita wizard
    const shouldSkipWizard = user?.is_super_admin || hasMultipleOrganizations;

    // Necesita crear organización si no tiene ninguna y no debe saltar el wizard
    const needsOrganization = !hasOrganizations && !shouldSkipWizard;

    return {
      hasOrganizations,
      hasMultipleOrganizations,
      needsOrganization,
      currentOrganization,
      shouldSkipWizard,
    };
  };
