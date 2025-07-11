import React from "react";

interface InitialSetupCheckProps {
  children: React.ReactNode;
}

const InitialSetupCheck = ({ children }: InitialSetupCheckProps) => {
  // This component is now just a wrapper for backward compatibility
  // The main logic has been moved to useInitialSetupRedirect hook
  // and handled in the auth flow
  return <>{children}</>;
};

export default InitialSetupCheck;
