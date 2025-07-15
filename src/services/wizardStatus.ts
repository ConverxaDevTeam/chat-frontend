import { axiosInstance } from "@store/actions/auth";
import { toast } from "react-toastify";

export type WizardStatus =
  | "organization"
  | "department"
  | "agent"
  | "knowledge"
  | "chat"
  | "integration";

export const updateWizardStatus = async (
  organizationId: number,
  wizardStatus: WizardStatus
): Promise<boolean> => {
  try {
    const response = await axiosInstance.patch(
      `/api/organization/${organizationId}/wizard-status`,
      { wizardStatus }
    );

    if (response.data.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error updating wizard status:", error);
    toast.error("Error al actualizar el estado del wizard");
    return false;
  }
};
