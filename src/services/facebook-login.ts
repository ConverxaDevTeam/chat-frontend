import { ensureFBSDKLoaded } from "@utils/facebook-init";
import { alertError } from "@utils/alerts";

export interface FacebookLoginOptions {
  configId: string;
  onSuccess: (code: string) => void;
  onError?: (error: unknown) => void;
  platform: "whatsapp" | "messenger";
}

export const facebookLogin = async (options: FacebookLoginOptions) => {
  const { configId, onSuccess, onError, platform } = options;

  try {
    console.log(`Facebook Login: Iniciando login para ${platform}`);

    // Cargar Facebook SDK
    const FB = await ensureFBSDKLoaded();

    console.log(
      `Facebook Login: SDK cargado, ejecutando FB.login para ${platform}`
    );

    // Ejecutar login de Facebook
    FB.login(
      response => {
        console.log(
          `Facebook Login: Respuesta recibida para ${platform}`,
          response
        );

        if (response.authResponse && response.authResponse.code) {
          const code = response.authResponse.code;
          onSuccess(code);
        } else {
          console.log(
            `Facebook Login: Login falló o fue cancelado para ${platform}`
          );
          if (onError) {
            onError(new Error("Login falló o fue cancelado"));
          }
        }
      },
      {
        config_id: configId,
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
    console.error(`Error en Facebook login para ${platform}:`, error);
    const errorMessage = `Error al iniciar la integración de ${platform}`;
    alertError(errorMessage);
    if (onError) {
      onError(error);
    }
  }
};
