import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { useNavigate } from "react-router-dom";

interface InitialSetupCheckProps {
  children: React.ReactNode;
}

const InitialSetupCheck = ({ children }: InitialSetupCheckProps) => {
  const { user, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated, not a super admin, and has no organizations
    if (
      user &&
      !user.is_super_admin &&
      (!myOrganizations || myOrganizations.length === 0)
    ) {
      navigate("/initial-setup");
    }
  }, [user, myOrganizations, navigate]);

  return <>{children}</>;
};

export default InitialSetupCheck;
