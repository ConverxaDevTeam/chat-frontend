import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import InitialSetupWizard from "@components/InitialSetupWizard";
import { useWizardStepVerification } from "@hooks/wizard";

const WizardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { myOrganizations } = useSelector((state: RootState) => state.auth);

  // Usar verificación dinámica del wizard
  const wizardVerification = useWizardStepVerification();

  const handleWizardClose = () => {
    // If user closes wizard without completing and has no organizations, redirect to login
    if (!myOrganizations || myOrganizations.length === 0) {
      navigate("/");
      return;
    }

    // If user has organizations, go to dashboard
    navigate("/dashboard");
  };

  const handleWizardComplete = async () => {
    // Refresh organizations and redirect to dashboard
    await dispatch(getMyOrganizationsAsync());
    navigate("/dashboard");
  };

  // Redirect if user shouldn't be here based on dynamic verification
  if (!wizardVerification.shouldShowWizard) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {wizardVerification.isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Cargando configuración del wizard...
          </p>
        </div>
      ) : (
        <InitialSetupWizard
          isOpen={true}
          onClose={handleWizardClose}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
};

export default WizardPage;
