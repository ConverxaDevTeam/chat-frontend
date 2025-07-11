import { useState } from "react";
import { SetupStepId, SetupTab } from "../types";

export const useTabNavigation = (initialTab: SetupStepId) => {
  const [activeTab, setActiveTab] = useState<SetupStepId>(initialTab);

  const baseTabsDefinition: Omit<SetupTab, "status">[] = [
    {
      id: "organization",
      label: "Crear organización",
    },
    {
      id: "department",
      label: "Crear departamento",
    },
    {
      id: "agent",
      label: "Crear un agente",
    },
    {
      id: "knowledge",
      label: "Base de conocimiento",
    },
    {
      id: "chat",
      label: "Configurar el chat",
    },
    {
      id: "interface",
      label: "Configura el diseño",
    },
    {
      id: "integration",
      label: "Integra el chat",
    },
    {
      id: "final",
      label: "Finalizar",
    },
  ];

  const tabs: SetupTab[] = baseTabsDefinition;

  const currentStepIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentStepIndex === 0;
  const isLastTab = currentStepIndex === tabs.length - 1;

  const goToNextTab = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentStepIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentStepIndex - 1].id);
    }
  };

  return {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
    currentStepIndex,
  };
};
