import React, { createContext, useContext, useState, ReactNode } from "react";

interface ApplicationsSidebarContextType {
  isApplicationsSidebarOpen: boolean;
  openApplicationsSidebar: () => void;
  closeApplicationsSidebar: () => void;
}

const ApplicationsSidebarContext = createContext<
  ApplicationsSidebarContextType | undefined
>(undefined);

export const ApplicationsSidebarProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isApplicationsSidebarOpen, setIsApplicationsSidebarOpen] =
    useState(false);

  const openApplicationsSidebar = () => {
    setIsApplicationsSidebarOpen(true);
  };

  const closeApplicationsSidebar = () => {
    setIsApplicationsSidebarOpen(false);
  };

  return (
    <ApplicationsSidebarContext.Provider
      value={{
        isApplicationsSidebarOpen,
        openApplicationsSidebar,
        closeApplicationsSidebar,
      }}
    >
      {children}
    </ApplicationsSidebarContext.Provider>
  );
};

export const useApplicationsSidebar = (): ApplicationsSidebarContextType => {
  const context = useContext(ApplicationsSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useApplicationsSidebar must be used within an ApplicationsSidebarProvider"
    );
  }
  return context;
};
