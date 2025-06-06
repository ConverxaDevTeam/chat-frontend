import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { requestCustomPlan } from "@services/planService";
import { OrganizationType } from "@interfaces/organization.interface";

// Define the structure of the organization based on the actual Redux state
interface OrganizationData {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  plan_type?: string; // Using plan_type instead of type
  plan_info?: {
    hasReachedLimit?: boolean;
    limit?: number;
    current?: number;
    daysRemaining?: number;
  };
  // Add other fields if necessary
}

interface UserOrganization {
  id: number; // This is the user-organization link ID
  role: string;
  organization: OrganizationData;
}

const PlanStatusBanner: React.FC = () => {
  const { myOrganizations, selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  // Referencia para medir la altura del banner - IMPORTANTE: los hooks deben estar al inicio
  const bannerRef = React.useRef<HTMLDivElement>(null);

  // Función para establecer la altura del banner como variable CSS
  const setBannerHeight = (height: number) => {
    document.documentElement.style.setProperty(
      "--banner-height",
      `${height}px`
    );
  };

  // Efecto para limpiar la variable CSS cuando el componente se desmonta
  // IMPORTANTE: todos los useEffect deben estar juntos al inicio del componente
  React.useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--banner-height");
    };
  }, []);

  // Efecto para medir y establecer la altura del banner cuando se renderiza
  React.useEffect(() => {
    // Si el banner no debe mostrarse, establecer altura en 0
    if (!shouldShowBanner()) {
      setBannerHeight(0);
      return;
    }

    // Si el banner debe mostrarse, medir su altura
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      setBannerHeight(height);
    }

    // Actualizar la altura si cambia el tamaño de la ventana
    const handleResize = () => {
      if (bannerRef.current && shouldShowBanner()) {
        const height = bannerRef.current.offsetHeight;
        setBannerHeight(height);
      } else {
        setBannerHeight(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myOrganizations, selectOrganizationId]); // Dependencias actualizadas para re-ejecutar cuando cambian

  // Función para determinar si se debe mostrar el banner
  function shouldShowBanner(): boolean {
    if (
      !myOrganizations ||
      myOrganizations.length === 0 ||
      selectOrganizationId === null
    ) {
      return false;
    }

    const selectedUserOrg = myOrganizations.find(
      (userOrg: UserOrganization) =>
        userOrg.organization.id === selectOrganizationId
    );

    if (!selectedUserOrg || !selectedUserOrg.organization) {
      return false;
    }

    const currentOrganization = selectedUserOrg.organization;
    return currentOrganization.type === OrganizationType.FREE;
  }

  // Si no se debe mostrar el banner, retornar null
  if (!shouldShowBanner()) {
    return null;
  }

  // Obtener la organización actual para mostrar información relevante
  const selectedUserOrg = myOrganizations.find(
    (userOrg: UserOrganization) =>
      userOrg.organization.id === selectOrganizationId
  );
  const currentOrganization = selectedUserOrg!.organization;
  const daysRemaining = currentOrganization.limitInfo?.daysRemaining;

  const handleRequestCustomPlan = async () => {
    try {
      await requestCustomPlan(currentOrganization.id);
      // Success toast is handled by the service
    } catch (error) {
      // Error toast is handled by the service
    }
  };

  return (
    <div
      ref={bannerRef}
      className="w-full bg-[#FFF3CD] text-[#856404] py-2.5 px-5 text-center border-b border-[#FFEEBA] text-sm"
    >
      {typeof daysRemaining === "number" && daysRemaining >= 0 && (
        <span>
          Te quedan {daysRemaining} día{daysRemaining !== 1 ? "s" : ""} de tu
          plan gratuito.
        </span>
      )}
      {(typeof daysRemaining !== "number" || daysRemaining < 0) && (
        <span>Estás en el plan gratuito. </span>
      )}
      <button
        onClick={handleRequestCustomPlan}
        className="ml-4 px-2.5 py-1.5 bg-[#007bff] text-white border-none rounded cursor-pointer font-bold"
      >
        ¡Actualiza a Pro!
      </button>
    </div>
  );
};

export default PlanStatusBanner;
