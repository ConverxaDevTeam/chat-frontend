import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { requestCustomPlan } from "@services/planService";
import { OrganizationType } from "@interfaces/organization.interface";

// Define the structure of the organization based on the actual Redux state
interface OrganizationData {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  plan_type?: string; // Using plan_type instead of type
  plan_info?: {
    hasReachedLimit?: boolean;
    limit?: number;
    current?: number;
    daysRemaining?: number;
  };
  // Add other fields if necessary
}

interface UserOrganization {
  id: number; // This is the user-organization link ID
  role: string;
  organization: OrganizationData;
}

const PlanStatusBanner: React.FC = () => {
  const { myOrganizations, selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  if (
    !myOrganizations ||
    myOrganizations.length === 0 ||
    selectOrganizationId === null
  ) {
    return null; // No organizations or no selected organization
  }

  const selectedUserOrg = myOrganizations.find(
    (userOrg: UserOrganization) =>
      userOrg.organization.id === selectOrganizationId
  );

  if (!selectedUserOrg || !selectedUserOrg.organization) {
    return null; // Selected organization not found in the list
  }

  const currentOrganization = selectedUserOrg.organization;
  // Display banner only for 'free' plan type
  if (currentOrganization.type !== OrganizationType.FREE) {
    return null;
  }

  const daysRemaining = currentOrganization.limitInfo?.daysRemaining;
  const handleRequestCustomPlan = async () => {
    try {
      await requestCustomPlan(currentOrganization.id);
      // Success toast is handled by the service
    } catch (error) {
      // Error toast is handled by the service
      console.error("Failed to request custom plan:", error);
    }
  };

  return (
    <div className="w-full bg-[#FFF3CD] text-[#856404] py-2.5 px-5 text-center border-b border-[#FFEEBA] text-sm z-50 relative">
      {typeof daysRemaining === "number" && daysRemaining >= 0 && (
        <span>
          Te quedan {daysRemaining} día{daysRemaining !== 1 ? "s" : ""} de tu
          plan gratuito.
        </span>
      )}
      {(typeof daysRemaining !== "number" || daysRemaining < 0) && (
        <span>Estás en el plan gratuito. </span>
      )}
      <button
        onClick={handleRequestCustomPlan}
        className="ml-4 px-2.5 py-1.5 bg-[#007bff] text-white border-none rounded cursor-pointer font-bold"
      >
        ¡Actualiza a Pro!
      </button>
    </div>
  );
};

export default PlanStatusBanner;
