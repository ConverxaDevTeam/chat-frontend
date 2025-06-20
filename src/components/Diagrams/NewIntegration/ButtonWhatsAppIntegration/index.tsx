import ButtonIntegracion from "../ButtonIntegracion";
import { createIntegrationWhatsApp } from "@services/facebook";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useEffect, useMemo, useState } from "react";
import Modal from "@components/Modal";
import { createIntegrationWhatsAppManual } from "@services/integration";
import { ensureFBSDKLoaded } from "@utils/facebook-init";

interface ButtonWhatsAppIntegrationProps {
  getDataIntegrations: () => void;
  departmentId: number | null;
  close: () => void;
}

const ButtonWhatsAppIntegration = ({
  getDataIntegrations,
  departmentId,
  close,
}: ButtonWhatsAppIntegrationProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [menuIntegracion, setMenuIntegracion] = useState<boolean>(false);
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
    try {
      console.log(
        "ButtonWhatsAppIntegration: Asegurando que el SDK de Facebook esté cargado"
      );

      // Obtener el objeto FB inicializado
      const FB = await ensureFBSDKLoaded();

      console.log(
        "ButtonWhatsAppIntegration: SDK de Facebook cargado, llamando a FB.login"
      );

      // Usar el objeto FB devuelto directamente
      FB.login(
        response => {
          console.log(
            "ButtonWhatsAppIntegration: Respuesta de FB.login recibida",
            response
          );
          // Respuesta recibida de la integración de WhatsApp
          if (response.authResponse && response.authResponse.code) {
            const code = response.authResponse.code;
            setData(prev => ({ ...prev, code }));
          } else {
            console.log(
              "ButtonWhatsAppIntegration: FB.login falló o fue cancelado"
            );
          }
        },
        {
          config_id: import.meta.env.VITE_FB_CONFIG_ID,
          response_type: "code",
          override_default_response_type: true,
          extras: {
            setup: {},
            featureType: "",
            sessionInfoVersion: "3",
          },
        }
      );
    } catch (error) {
      console.error(
        "Error en el proceso de inicio de sesión de Facebook:",
        error
      );
    }
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
        close();
      }
      // Limpiar datos después de procesar la integración
      setData({ code: null, phone_number_id: null, waba_id: null });
    }
  };

  const handleCreateIntegrationWhatsAppManual = async () => {
    if (!departmentId || !selectOrganizationId) return;

    const response = await createIntegrationWhatsAppManual(
      selectOrganizationId,
      departmentId
    );
    if (response) {
      getDataIntegrations();
      setMenuIntegracion(false);
      close();
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
    <>
      <Modal
        isShown={menuIntegracion}
        header={<h1>Integración de Messenger</h1>}
        onClose={() => setMenuIntegracion(false)}
      >
        <div className="flex gap-[16px]">
          <ButtonIntegracion
            action={handleConnectFacebook}
            Icon="whatsapp"
            text="WhatsApp Integración Automática"
          />
          <ButtonIntegracion
            action={handleCreateIntegrationWhatsAppManual}
            Icon="whatsapp"
            text="WhatsApp Integración Manual"
          />
        </div>
      </Modal>
      <ButtonIntegracion
        action={() => setMenuIntegracion(true)}
        Icon="whatsapp"
        text="Whatsapp"
      />
    </>
  );
};

export default ButtonWhatsAppIntegration;
