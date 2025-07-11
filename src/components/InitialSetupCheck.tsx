import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { useNavigate } from "react-router-dom";
import InitialSetupWizard from "./InitialSetupWizard";

interface InitialSetupCheckProps {
  children: React.ReactNode;
}

const InitialSetupCheck = ({ children }: InitialSetupCheckProps) => {
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  useEffect(() => {
    // Check if wizard was in progress
    const savedWizardState = localStorage.getItem("wizardState");

    // Check if user is authenticated, not a super admin, and has no organizations OR has incomplete wizard
    if (
      user &&
      !user.is_super_admin &&
      (!myOrganizations || myOrganizations.length === 0 || savedWizardState)
    ) {
      setShowSetupWizard(true);
    } else {
      setShowSetupWizard(false);
    }
  }, [user, myOrganizations]);

  const handleWizardClose = () => {
    // If user closes wizard without completing, redirect to login
    if (!myOrganizations || myOrganizations.length === 0) {
      navigate("/");
    }
    setShowSetupWizard(false);
  };

  return (
    <>
      {children}
      <InitialSetupWizard
        isOpen={showSetupWizard}
        onClose={handleWizardClose}
      />
    </>
  );
};

export default InitialSetupCheck;
