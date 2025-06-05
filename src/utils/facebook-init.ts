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

// Singleton promise to track Facebook SDK initialization
let fbSDKPromise: Promise<void> | null = null;

/**
 * Initializes the Facebook SDK
 * This follows the official Facebook SDK initialization pattern
 */
export function initFacebookSDK(): Promise<void> {
  // Return existing promise if already initializing
  if (fbSDKPromise) {
    return fbSDKPromise;
  }

  console.log("Initializing Facebook SDK");

  // Create a new promise for the initialization
  fbSDKPromise = new Promise<void>(resolve => {
    // 1. Define the async init function that Facebook will call when SDK is loaded
    window.fbAsyncInit = function () {
      console.log("Facebook SDK loaded, initializing...");
      window.FB.init({
        appId: import.meta.env.VITE_FB_APP_ID,
        autoLogAppEvents: true,
        status: true,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });

      console.log("Facebook SDK initialized successfully");
      resolve();
    };

    // 2. Load the SDK asynchronously
    (function (d, s, id) {
      console.log("Loading Facebook SDK script...");
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/es_LA/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
      console.log("Facebook SDK script added to DOM");
    })(document, "script", "facebook-jssdk");
  });

  return fbSDKPromise;
}

/**
 * Ensures the Facebook SDK is loaded and initialized before using FB functions
 * Call this before any FB.login() or other FB methods
 */
export async function ensureFBSDKLoaded(): Promise<void> {
  // If FB is already defined, we can use it directly
  if (typeof window.FB !== "undefined") {
    console.log("Facebook SDK already available");
    return Promise.resolve();
  }

  // Otherwise initialize or wait for initialization
  console.log("Waiting for Facebook SDK to load...");
  return fbSDKPromise || initFacebookSDK();
}

/**
 * Function to check if FB SDK is ready
 */
export function isFacebookSDKReady(): boolean {
  return typeof window.FB !== "undefined" && fbSDKPromise !== null;
}
