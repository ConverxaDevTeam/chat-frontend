import { useNavigate } from "react-router-dom";
import { useInitialSetupRedirect } from "./useInitialSetupRedirect";

export const usePostLoginRedirect = () => {
  const navigate = useNavigate();
  const { shouldShowWizard, redirectPath } = useInitialSetupRedirect();

  const handlePostLoginRedirect = () => {
    navigate(redirectPath);
  };

  return {
    shouldShowWizard,
    redirectPath,
    handlePostLoginRedirect,
  };
};
