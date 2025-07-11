import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { getMyOrganizationsAsync } from "@store/actions/auth";
import InitialSetupWizard from "@components/InitialSetupWizard";

const WizardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

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

  // Redirect if user shouldn't be here
  if (user?.is_super_admin || (myOrganizations && myOrganizations.length > 0)) {
    const savedWizardState = localStorage.getItem("wizardState");
    if (!savedWizardState) {
      navigate("/dashboard");
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <InitialSetupWizard
        isOpen={true}
        onClose={handleWizardClose}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};

export default WizardPage;
