// Declaración de tipos para el SDK de Facebook
declare global {
  interface Window {
    fbAsyncInit: () => void;
    fbPromise?: Promise<void>;
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

// Promise to track when Facebook SDK is fully loaded and initialized
let fbSDKPromise: Promise<void> | null = null;

// Inicialización del SDK de Facebook con variables de entorno
export function initFacebookSDK(): Promise<void> {
  if (fbSDKPromise) {
    return fbSDKPromise;
  }

  fbSDKPromise = new Promise<void>(resolve => {
    // Set up the async init function
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FB_APP_ID,
        autoLogAppEvents: true,
        status: true,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
      resolve(); // Resolve the promise when FB is initialized
    };

    // Cargar el SDK de Facebook de manera asíncrona
    (function (d, s, id) {
      let js: HTMLScriptElement | null = null;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/es_LA/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });

  // Make the promise accessible globally
  window.fbPromise = fbSDKPromise;

  return fbSDKPromise;
}

// Helper function to ensure FB SDK is ready before use
export async function ensureFBSDKLoaded(): Promise<void> {
  if (typeof window.FB !== "undefined") {
    return Promise.resolve();
  }

  return fbSDKPromise || initFacebookSDK();
}
