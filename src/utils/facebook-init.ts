// Declaración de tipos para el SDK de Facebook
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (options: {
        appId: string;
        autoLogAppEvents: boolean;
        status: boolean;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            code?: string;
          };
        }) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          scope?: string;
          extras: {
            setup: Record<string, unknown>;
            featureType: string;
            sessionInfoVersion: string;
          };
        }
      ) => void;
    };
  }
}

// Variable para rastrear si el SDK ya está inicializado
let isFBInitialized = false;

// Promesa para rastrear la inicialización del SDK
let fbSDKPromise: Promise<typeof window.FB> | null = null;

/**
 * Inicializa el SDK de Facebook siguiendo el patrón oficial
 * Esta función debe llamarse lo antes posible en el ciclo de vida de la aplicación
 */
export function initFacebookSDK(): Promise<typeof window.FB> {
  // Si ya tenemos una promesa en curso, la devolvemos
  if (fbSDKPromise) {
    return fbSDKPromise;
  }

  console.log("Iniciando inicialización del SDK de Facebook");

  // Creamos una nueva promesa para la inicialización
  fbSDKPromise = new Promise<typeof window.FB>((resolve, reject) => {
    // Comprobamos si el SDK ya está disponible
    if (typeof window.FB !== "undefined" && isFBInitialized) {
      console.log("SDK de Facebook ya inicializado");
      resolve(window.FB);
      return;
    }

    // Función que se ejecutará cuando el SDK esté cargado
    const originalAsyncInit = window.fbAsyncInit;

    window.fbAsyncInit = function () {
      // Si ya había una función fbAsyncInit definida (por ejemplo, en el HTML), la ejecutamos primero
      if (originalAsyncInit && originalAsyncInit !== window.fbAsyncInit) {
        originalAsyncInit();
      }

      try {
        console.log("SDK de Facebook cargado, inicializando...");
        console.log({
          appId: import.meta.env.VITE_FB_APP_ID,
          autoLogAppEvents: true,
          status: true,
          cookie: true,
          xfbml: true,
          version: "v22.0",
        });
        window.FB.init({
          appId: import.meta.env.VITE_FB_APP_ID,
          autoLogAppEvents: true,
          status: true,
          cookie: true,
          xfbml: true,
          version: "v22.0",
        });

        isFBInitialized = true;
        console.log("SDK de Facebook inicializado correctamente");
        resolve(window.FB);
      } catch (error) {
        console.error("Error al inicializar el SDK de Facebook:", error);
        reject(error);
      }
    };

    // Cargamos el script del SDK si aún no está cargado
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/es_LA/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onerror = error => {
        console.error("Error al cargar el script del SDK de Facebook:", error);
        reject(new Error("No se pudo cargar el script del SDK de Facebook"));
      };

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
        console.log("Script del SDK de Facebook añadido al DOM");
      } else {
        document.head.appendChild(script);
        console.log("Script del SDK de Facebook añadido al head");
      }
    }
  });

  return fbSDKPromise;
}

/**
 * Asegura que el SDK de Facebook esté cargado e inicializado antes de usar sus funciones
 * Llama a esta función antes de usar FB.login() u otros métodos de FB
 * @returns El objeto FB inicializado
 */
export async function ensureFBSDKLoaded(): Promise<typeof window.FB> {
  try {
    // Si ya tenemos una promesa, esperamos a que se resuelva
    if (fbSDKPromise) {
      return await fbSDKPromise;
    }

    // Si no, iniciamos la inicialización
    return await initFacebookSDK();
  } catch (error) {
    console.error("Error al cargar el SDK de Facebook:", error);
    throw error;
  }
}

/**
 * Comprueba si el SDK de Facebook está listo para usarse
 */
export function isFacebookSDKReady(): boolean {
  return typeof window.FB !== "undefined" && isFBInitialized;
}
