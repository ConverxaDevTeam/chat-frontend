import { BsWhatsapp } from "react-icons/bs";
import ButtonIntegracion from "../ButtonIntegracion";
import { createIntegrationWhatsApp } from "@services/facebook";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useEffect, useRef, useState } from "react";

interface ButtonWhatsAppIntegrationProps {
  getDataIntegrations: () => void;
  departmentId: number | null;
}

const ButtonWhatsAppIntegration = ({
  getDataIntegrations,
  departmentId,
}: ButtonWhatsAppIntegrationProps) => {
  const [trigger, setTrigger] = useState(false);
  const dataRef = useRef<{
    code: string | null;
    phone_number_id: string | null;
    waba_id: string | null;
  }>({
    code: null,
    phone_number_id: null,
    waba_id: null,
  });
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleConnectFacebook = async () => {
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          dataRef.current.code = response.authResponse.code;
          setTrigger(!trigger);
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
      dataRef.current.phone_number_id = info.data.phone_number_id;
      dataRef.current.waba_id = info.data.waba_id;
      setTrigger(!trigger);
    }
  };

  const handleCreateIntegration = async () => {
    if (departmentId && selectOrganizationId) {
      const { code, phone_number_id, waba_id } = dataRef.current;
      if (!code || !phone_number_id || !waba_id) {
        return;
      }
      const integration = await createIntegrationWhatsApp(
        departmentId,
        selectOrganizationId,
        {
          code,
          phone_number_id,
          waba_id,
        }
      );
      if (integration) {
        getDataIntegrations();
      }
      dataRef.current = {
        code: null,
        phone_number_id: null,
        waba_id: null,
      };
      setTrigger(!trigger);
    }
  };

  useEffect(() => {
    if (
      dataRef.current.code &&
      dataRef.current.phone_number_id &&
      dataRef.current.waba_id
    ) {
      handleCreateIntegration();
    }
  }, [trigger]);

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
