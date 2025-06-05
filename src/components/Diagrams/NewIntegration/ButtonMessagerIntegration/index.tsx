import ButtonIntegracion from "../ButtonIntegracion";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import {
  getPagesFacebook,
  createIntegrationMessager,
} from "@services/facebook";
import { useState } from "react";
import Modal from "@components/Modal";
import Loading from "@components/Loading";
import { createIntegrationMessagerManual } from "@services/integration";
import { ensureFBSDKLoaded } from "@utils/facebook-init";

interface ButtonMessagerIntegrationProps {
  getDataIntegrations: () => void;
  departmentId: number | null;
  close: () => void;
}

interface FacebookPage {
  id: string;
  access_token: string;
  category: string;
  category_list: {
    id: string;
    name: string;
  }[];
  name: string;
  tasks: string[];
}

const ButtonMessagerIntegration = ({
  getDataIntegrations,
  departmentId,
  close,
}: ButtonMessagerIntegrationProps) => {
  const [menuIntegracion, setMenuIntegracion] = useState<boolean>(false);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleConnectFacebook = async () => {
    setLoading(true);
    try {
      console.log("ButtonMessagerIntegration: Ensuring Facebook SDK is loaded");
      // Ensure Facebook SDK is loaded and initialized before using FB.login
      // The ensureFBSDKLoaded function now returns the FB object
      const FB = await ensureFBSDKLoaded();

      console.log(
        "ButtonMessagerIntegration: Facebook SDK loaded, calling FB.login"
      );
      // Use the returned FB object directly
      FB.login(
        response => {
          console.log(
            "ButtonMessagerIntegration: FB.login response received",
            response
          );
          if (response.authResponse && response.authResponse.code) {
            setOpenModal(true);
            const code = response.authResponse.code;
            if (departmentId && selectOrganizationId) {
              getPagesFacebook(departmentId, selectOrganizationId, code)
                .then(response => {
                  setPages(response);
                  setLoading(false);
                })
                .catch(error => {
                  console.error("Error getting Facebook pages:", error);
                  setLoading(false);
                });
            } else {
              setLoading(false);
            }
          } else {
            // Handle case where login was not successful
            console.log(
              "ButtonMessagerIntegration: FB.login failed or was cancelled"
            );
            setLoading(false);
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
      console.error("Error in Facebook login process:", error);
      setLoading(false);
    }
    setMenuIntegracion(false);
  };

  const handleCreateIntegrationFacebookManual = async () => {
    if (!departmentId || !selectOrganizationId) return;

    const response = await createIntegrationMessagerManual(
      selectOrganizationId,
      departmentId
    );
    if (response) {
      getDataIntegrations();
      setMenuIntegracion(false);
      close();
    }
  };

  return (
    <>
      <Modal
        isShown={openModal}
        onClose={() => setOpenModal(false)}
        header={<h1>Conectar Página de Facebook</h1>}
      >
        <div className="w-[460px] h-[300px] overflow-hidden flex flex-col gap-[16px]">
          {loading ? (
            <Loading />
          ) : (
            <>
              <h1>Conectar Página de Facebook</h1>
              <div className="flex flex-col gap-[16px]">
                {pages.length > 0 ? (
                  pages.map(page => {
                    const handleConnect = async () => {
                      if (!departmentId || !selectOrganizationId) return;
                      const response = await createIntegrationMessager(
                        departmentId,
                        selectOrganizationId,
                        {
                          access_token: page.access_token,
                          id: page.id,
                        }
                      );
                      if (response) {
                        getDataIntegrations();
                        setMenuIntegracion(false);
                        close();
                      }
                    };
                    return (
                      <div key={page.id} className="flex flex-col gap-[8px]">
                        <span>{page.name}</span>
                        <button
                          onClick={handleConnect}
                          className="bg-sofia-electricGreen text-sofia-superDark p-[8px] rounded-md"
                        >
                          Conectar
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>
                    No se encontraron páginas de Facebook para conectar o se
                    requieren permiso <strong>pages_show_list</strong>.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        isShown={menuIntegracion}
        header={<h1>Integración de Messenger</h1>}
        onClose={() => setMenuIntegracion(false)}
      >
        <div className="flex gap-[16px]">
          <ButtonIntegracion
            action={handleConnectFacebook}
            Icon="messenger-gray"
            text="Messenger Integración Automática"
          />
          <ButtonIntegracion
            action={handleCreateIntegrationFacebookManual}
            Icon="messenger"
            text="Messenger Integración Manual"
          />
        </div>
      </Modal>
      <ButtonIntegracion
        action={() => setMenuIntegracion(true)}
        Icon="messenger"
        text="Messenger"
      />
    </>
  );
};

export default ButtonMessagerIntegration;
