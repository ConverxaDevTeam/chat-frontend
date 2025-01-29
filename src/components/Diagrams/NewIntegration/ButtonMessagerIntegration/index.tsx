import { FaFacebook } from "react-icons/fa";
import ButtonIntegracion from "../ButtonIntegracion";
import { createIntegrationMessager } from "@services/facebook";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useEffect, useMemo, useState } from "react";

interface ButtonMessagerIntegrationProps {
  getDataIntegrations: () => void;
  departmentId: number | null;
  close: () => void;
}

const ButtonMessagerIntegration = ({
  getDataIntegrations,
  departmentId,
  close,
}: ButtonMessagerIntegrationProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const [data, setData] = useState<{
    code: string | null;
    data: string | null;
  }>({
    code: null,
    data: null,
  });

  const isDataComplete = useMemo(() => {
    return data.code && data.data;
  }, [data]);

  const handleConnectFacebook = async () => {
    FB.login(
      response => {
        if (response.authResponse && response.authResponse.code) {
          const code = response.authResponse.code;
          setData(prev => ({ ...prev, code }));
        }
      },
      {
        config_id: "27899170796396553",
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

    if (event.type === "message") {
      setData(prev => ({
        ...prev,
        data: event.data,
      }));
    }
  };

  const handleCreateIntegration = async () => {
    if (departmentId && selectOrganizationId && isDataComplete) {
      const integration = await createIntegrationMessager(
        departmentId,
        selectOrganizationId,
        data
      );
      if (integration) {
        getDataIntegrations();
        close();
      }
      // Limpiar datos después de procesar la integración
      setData({ code: null, data: null });
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
      Icon={FaFacebook}
      text="Messager"
    />
  );
};

export default ButtonMessagerIntegration;
