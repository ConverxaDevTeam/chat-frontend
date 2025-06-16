import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, NodeData } from "@interfaces/workflow";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import { ConfigWebChat } from "@pages/Workspace/components/CustomizeChat";
import { ContextMenuOption } from "./DiagramContextMenu";
import { IntegrationType } from "@interfaces/integrations";
import { useCounter } from "@hooks/CounterContext";
import {
  createIntegrationWhatsAppManual,
  createIntegrationMessagerManual,
} from "@services/integration";
import { createIntegrationWhatsApp } from "@services/facebook";
import { baseUrl } from "@config/config";
import { alertError, alertConfirm } from "@utils/alerts";
import { ensureFBSDKLoaded } from "@utils/facebook-init";
import { useState, useEffect, useMemo } from "react";

export interface ConfigWhatsApp {
  name_app: string | null;
  phone: string | null;
  token_expire: string | null;
}

export interface ConfigMessenger {
  page_id: string;
  app_id: string;
  app_secret: string;
}

export interface IIntegration {
  id: number;
  created_at: string;
  updated_at: string;
  type: IntegrationType;
  config: ConfigWebChat | ConfigWhatsApp | ConfigMessenger;
}

const IntegracionesNode = ({
  data,
  selected,
  ...rest
}: CustomTypeNodeProps<NodeData>) => {
  const { increment } = useCounter();
  const selectedDepartmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );
  const { selectOrganizationId, myOrganizations } = useSelector(
    (state: RootState) => state.auth
  );

  const [whatsAppAutoData, setWhatsAppAutoData] = useState<{
    code: string | null;
    phone_number_id: string | null;
    waba_id: string | null;
  }>({
    code: null,
    phone_number_id: null,
    waba_id: null,
  });

  // Obtener el nombre de la organización actual
  const currentOrganizationName = useMemo(() => {
    const currentOrg = myOrganizations.find(
      org => org.organization?.id === selectOrganizationId
    );
    return currentOrg?.organization?.name?.toLowerCase() || "";
  }, [myOrganizations, selectOrganizationId]);

  // Verificar si la lógica de WhatsApp automático está completa
  const isWhatsAppAutoDataComplete = useMemo(() => {
    return (
      whatsAppAutoData.code &&
      whatsAppAutoData.phone_number_id &&
      whatsAppAutoData.waba_id
    );
  }, [whatsAppAutoData]);

  const getDataIntegrations = () => {
    increment();
  };

  // Función para integración automática de WhatsApp
  const handleCreateIntegrationWhatsAppAuto = async () => {
    if (!selectedDepartmentId || !selectOrganizationId) return;

    try {
      console.log(
        "IntegracionesNode: Iniciando integración WhatsApp automática"
      );

      // Cargar Facebook SDK
      const FB = await ensureFBSDKLoaded();

      // Ejecutar login de Facebook
      FB.login(
        response => {
          console.log("IntegracionesNode: Respuesta FB.login", response);
          if (response.authResponse && response.authResponse.code) {
            const code = response.authResponse.code;
            setWhatsAppAutoData(prev => ({ ...prev, code }));
          } else {
            console.log("IntegracionesNode: FB.login falló o fue cancelado");
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
      console.error("Error en integración WhatsApp automática:", error);
      alertError("Error al iniciar la integración de WhatsApp automática");
    }
  };

  // Función para crear la integración WhatsApp automática
  const handleCreateWhatsAppAutoIntegration = async () => {
    if (
      selectedDepartmentId &&
      selectOrganizationId &&
      isWhatsAppAutoDataComplete
    ) {
      try {
        const integration = await createIntegrationWhatsApp(
          selectedDepartmentId,
          selectOrganizationId,
          whatsAppAutoData
        );
        if (integration) {
          getDataIntegrations();
          alertConfirm(
            "Canal WhatsApp automático creado exitosamente",
            "La integración está lista para usar"
          );
        }
        // Limpiar datos después de procesar
        setWhatsAppAutoData({
          code: null,
          phone_number_id: null,
          waba_id: null,
        });
      } catch (error) {
        alertError("Error al crear la integración de WhatsApp automática");
      }
    }
  };

  // Manejo de mensajes de Facebook
  const handleFacebookMessage = (event: MessageEvent) => {
    if (
      event.origin !== "https://www.facebook.com" &&
      event.origin !== "https://web.facebook.com"
    ) {
      return;
    }

    const info = JSON.parse(event.data);
    if (info.type === "WA_EMBEDDED_SIGNUP") {
      setWhatsAppAutoData(prev => ({
        ...prev,
        phone_number_id: info.data.phone_number_id,
        waba_id: info.data.waba_id,
      }));
    }
  };

  // Efectos para manejo de datos y eventos
  useEffect(() => {
    if (isWhatsAppAutoDataComplete) {
      handleCreateWhatsAppAutoIntegration();
    }
  }, [isWhatsAppAutoDataComplete]);

  useEffect(() => {
    window.addEventListener("message", handleFacebookMessage);
    return () => {
      window.removeEventListener("message", handleFacebookMessage);
    };
  }, []);

  // Función para integración manual de WhatsApp
  const handleCreateIntegrationWhatsAppManual = async () => {
    if (!selectedDepartmentId || !selectOrganizationId) return;

    try {
      const response = await createIntegrationWhatsAppManual(
        selectOrganizationId,
        selectedDepartmentId
      );
      if (response) {
        getDataIntegrations();
        alertConfirm(
          "Canal creado exitosamente",
          "Configura los detalles y comienza a utilizarlo"
        );
      }
    } catch (error) {
      alertError("Error al crear el canal de WhatsApp");
    }
  };

  // Función para integración manual de Messenger
  const handleCreateIntegrationMessagerManual = async () => {
    if (!selectedDepartmentId || !selectOrganizationId) return;

    try {
      const response = await createIntegrationMessagerManual(
        selectOrganizationId,
        selectedDepartmentId
      );
      if (response) {
        getDataIntegrations();
        alertConfirm(
          "Canal creado exitosamente",
          "Configura los detalles y comienza a utilizarlo"
        );
      }
    } catch (error) {
      alertError("Error al crear el canal de Facebook Messenger");
    }
  };

  // Función para integración de Slack
  const slackAuthUrl = async () => {
    if (!selectedDepartmentId || !selectOrganizationId) return;
    const clientId = "7464676423766.8502943266896";
    const redirectUri = encodeURIComponent(`${baseUrl}/api/slack/auth`);
    const scopes = encodeURIComponent(
      "channels:read,chat:write,im:history,im:write,mpim:read,users:read,users:read.email,users.profile:read,channels:manage,chat:write.public,commands,groups:write,conversations.connect:read,channels:history"
    );
    const state = encodeURIComponent(
      btoa(
        JSON.stringify({
          department_id: selectedDepartmentId,
          organization_id: selectOrganizationId,
        })
      )
    );
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

    const popup = window.open(
      slackAuthUrl,
      "popup",
      "scrollbars=no,resizable=no"
    );

    window.addEventListener("message", event => {
      if (event.data?.success) {
        getDataIntegrations();
        alertConfirm(
          "Canal creado exitosamente",
          "Configura los detalles y comienza a utilizarlo"
        );
      } else {
        alertError(event.data?.message);
      }
    });

    const checkPopupClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopupClosed);
      }
    }, 500);
  };

  const contextMenuOptions: ContextMenuOption[] = [
    {
      child: (
        <div className="group relative p-1">
          <img src="/mvp/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gray-800 text-white font-normal text-xs px-2 py-1 rounded whitespace-nowrap z-[9999]">
            WhatsApp
          </div>
        </div>
      ),
      onClick: handleCreateIntegrationWhatsAppManual,
    },
    // Agregar WhatsApp automático solo si la organización es 'facebook'
    ...(currentOrganizationName === "facebook"
      ? [
          {
            child: (
              <div className="group relative p-1">
                <div className="relative">
                  <img
                    src="/mvp/whatsapp.svg"
                    alt="WhatsApp Automático"
                    className="w-6 h-6"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">A</span>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gray-800 text-white font-normal text-xs px-2 py-1 rounded whitespace-nowrap z-[9999]">
                  WhatsApp Automático
                </div>
              </div>
            ),
            onClick: handleCreateIntegrationWhatsAppAuto,
          },
        ]
      : []),
    {
      child: (
        <div className="group relative p-1">
          <img src="/mvp/slack.svg" alt="Slack" className="w-6 h-6" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gray-800 text-white font-normal text-xs px-2 py-1 rounded whitespace-nowrap z-[9999]">
            Slack
          </div>
        </div>
      ),
      onClick: slackAuthUrl,
    },
    {
      child: (
        <div className="group relative p-1">
          <img
            src="/mvp/messenger.svg"
            alt="Facebook Messenger"
            className="w-6 h-6"
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gray-800 text-white font-normal text-xs px-2 py-1 rounded whitespace-nowrap z-[9999]">
            Facebook Messenger
          </div>
        </div>
      ),
      onClick: handleCreateIntegrationMessagerManual,
    },
  ];

  return (
    <>
      <DefaultNode
        selected={selected}
        data={{
          ...data,
          name: "Canales",
          description: "Conecta la plataforma con otras herramientas.",
        }}
        allowedConnections={["source", "target"]}
        icon={<img src="/mvp/cable.svg" alt="Integraciones" />}
        contextMenuOptions={contextMenuOptions}
        {...rest}
      ></DefaultNode>
    </>
  );
};

export default IntegracionesNode;
