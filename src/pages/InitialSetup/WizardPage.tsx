import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@store/index";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import InitialSetupWizard from "@components/InitialSetupWizard";
import { useWizardStatus } from "@hooks/wizard/useWizardStatus";

const WizardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { myOrganizations } = useSelector((state: RootState) => state.auth);

  // Usar wizardStatus del backend
  const wizardStatus = useWizardStatus();

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

  // Handle redirect using useEffect to avoid setState during render
  useEffect(() => {
    console.log("🔥 WizardPage useEffect triggered:", {
      isLoading: wizardStatus.isLoading,
      shouldShowWizard: wizardStatus.shouldShowWizard,
      currentStep: wizardStatus.currentStep,
      localStorageValue: localStorage.getItem("wizardIntegrationCompleted"),
    });

    if (!wizardStatus.isLoading && !wizardStatus.shouldShowWizard) {
      console.log("🔥 WizardPage: Redirecting to dashboard!");
      navigate("/dashboard");
    }
  }, [wizardStatus.isLoading, wizardStatus.shouldShowWizard, navigate]);

  // Don't render anything if we should redirect
  if (!wizardStatus.shouldShowWizard && !wizardStatus.isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {wizardStatus.isLoading ? (
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
