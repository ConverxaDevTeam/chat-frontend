import { BsWhatsapp } from "react-icons/bs";
import ButtonIntegracion from "../ButtonIntegracion";
import { createIntegrationWhatsApp } from "@services/facebook";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useEffect, useMemo, useState } from "react";

interface ButtonWhatsAppIntegrationProps {
  getDataIntegrations: () => void;
  departmentId: number | null;
}

const ButtonWhatsAppIntegration = ({
  getDataIntegrations,
  departmentId,
}: ButtonWhatsAppIntegrationProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [data, setData] = useState<{
    code: string | null;
    phone_number_id: string | null;
    waba_id: string | null;
  }>({
    code: null,
    phone_number_id: null,
    waba_id: null,
  });

  const isDataComplete = useMemo(() => {
    return data.code && data.phone_number_id && data.waba_id;
  }, [data]);

  const handleConnectFacebook = async () => {
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          const code = response.authResponse.code;
          setData(prev => ({ ...prev, code }));
        }
      },
      {
        config_id: "587940300399443",
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "",
          sessionInfoVersion: "3",
        },
      }
    );
  };

  const handleMessage = async (event: MessageEvent) => {
    if (
      event.origin !== "https://www.facebook.com" &&
      event.origin !== "https://web.facebook.com"
    ) {
      return;
    }

    const info = JSON.parse(event.data);
    if (info.type === "WA_EMBEDDED_SIGNUP") {
      setData(prev => ({
        ...prev,
        phone_number_id: info.data.phone_number_id,
        waba_id: info.data.waba_id,
      }));
    }
  };

  const handleCreateIntegration = async () => {
    if (departmentId && selectOrganizationId && isDataComplete) {
      const integration = await createIntegrationWhatsApp(
        departmentId,
        selectOrganizationId,
        data
      );
      if (integration) {
        getDataIntegrations();
      }
      // Limpiar datos después de procesar la integración
      setData({ code: null, phone_number_id: null, waba_id: null });
    }
  };

  useEffect(() => {
    if (isDataComplete) {
      handleCreateIntegration();
    }
  }, [isDataComplete]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <ButtonIntegracion
      action={handleConnectFacebook}
      Icon={BsWhatsapp}
      text="Whatsapp"
    />
  );
};

export default ButtonWhatsAppIntegration;
