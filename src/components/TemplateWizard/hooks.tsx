import { useState, useCallback, ReactElement } from "react";
import { toast } from "react-toastify";
import { AuthenticatorType } from "@interfaces/autenticators.interface";
import { authenticatorService } from "@services/authenticator.service";
import { functionsService } from "@services/functions.service";
import { useAlertContext } from "@components/Diagrams/components/AlertContext";

// Hook para gestionar la navegación por pestañas
export const useTabNavigation = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabs: Array<{
    id: string;
    label: string;
    icon: ReactElement;
  }> = [
    {
      id: "function",
      label: "Función",
      icon: <img src="/mvp/settings.svg" className="w-5 h-5" />,
    },
    {
      id: "params",
      label: "Parámetros",
      icon: <img src="/mvp/list.svg" className="w-5 h-5" />,
    },
  ];

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const isFirstTab = activeTab === tabs[0].id;
  const isLastTab = activeTab === tabs[tabs.length - 1].id;

  return {
    activeTab,
    setActiveTab,
    tabs,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab,
  };
};

// Hook para gestionar los autenticadores
export const useAuthenticators = (organizationId: number) => {
  const [authenticators, setAuthenticators] = useState<AuthenticatorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { showConfirmation } = useAlertContext();

  const fetchAuthenticators = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authenticatorService.fetchAll(organizationId);
      setAuthenticators(data);
    } catch (error) {
      toast.error("Error al cargar autenticadores");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const handleAuthenticatorChange = useCallback(
    async (functionId: number, authenticatorId: number | null) => {
      try {
        await functionsService.assignAuthenticator(functionId, authenticatorId);
        toast.success(
          authenticatorId
            ? "Autenticador asignado exitosamente"
            : "Autenticador removido exitosamente"
        );
        return true;
      } catch (error) {
        toast.error("Error al asignar el autenticador");
        return false;
      }
    },
    []
  );

  return {
    authenticators,
    loading,
    fetchAuthenticators,
    handleAuthenticatorChange,
    showAuthModal,
    setShowAuthModal,
    showConfirmation,
  };
};
