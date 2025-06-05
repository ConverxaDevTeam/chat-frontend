// Declaración de tipos para el SDK de Facebook
declare global {
  interface Window {
    fbAsyncInit: () => void;
    fbSDKInitialized?: boolean;
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
let fbSDKInitialized = false;

/**
 * Initializes the Facebook SDK
 * This follows the official Facebook SDK initialization pattern with additional safeguards
 */
export function initFacebookSDK(): Promise<void> {
  // Return existing promise if already initializing
  if (fbSDKPromise) {
    return fbSDKPromise;
  }

  console.log("Initializing Facebook SDK");

  // Create a new promise for the initialization
  fbSDKPromise = new Promise<void>(resolve => {
    // Check if FB is already available and initialized
    if (typeof window.FB !== "undefined" && window.fbSDKInitialized === true) {
      console.log("Facebook SDK already initialized globally");
      fbSDKInitialized = true;
      resolve();
      return;
    }

    // 1. Define the async init function that Facebook will call when SDK is loaded
    window.fbAsyncInit = function () {
      console.log("Facebook SDK loaded, initializing...");
      try {
        window.FB.init({
          appId: import.meta.env.VITE_FB_APP_ID,
          autoLogAppEvents: true,
          status: true,
          cookie: true,
          xfbml: true,
          version: "v22.0",
        });

        // Mark as initialized both locally and globally
        fbSDKInitialized = true;
        window.fbSDKInitialized = true;
        console.log("Facebook SDK initialized successfully");
        resolve();
      } catch (error) {
        console.error("Error initializing Facebook SDK:", error);
        // Still resolve to prevent hanging promises
        resolve();
      }
    };

    // 2. Load the SDK asynchronously if not already loaded
    if (!document.getElementById("facebook-jssdk")) {
      console.log("Loading Facebook SDK script...");
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/es_LA/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";

      const fjs = document.getElementsByTagName("script")[0];
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
        console.log("Facebook SDK script added to DOM");
      } else {
        document.head.appendChild(js);
        console.log("Facebook SDK script added to head");
      }
    } else {
      console.log("Facebook SDK script already in DOM");
    }
  });

  return fbSDKPromise;
}

/**
 * Ensures the Facebook SDK is loaded and initialized before using FB functions
 * Call this before any FB.login() or other FB methods
 * Returns the FB object to ensure proper scoping
 */
export async function ensureFBSDKLoaded(): Promise<typeof window.FB> {
  // First check if already initialized
  if (typeof window.FB !== "undefined" && window.fbSDKInitialized === true) {
    console.log("Facebook SDK already initialized and available");
    return window.FB;
  }

  // Otherwise initialize or wait for initialization
  console.log("Waiting for Facebook SDK to load...");
  await (fbSDKPromise || initFacebookSDK());

  // Double check that FB is actually available after initialization
  if (typeof window.FB === "undefined") {
    console.error("Facebook SDK still not available after initialization");
    throw new Error("Facebook SDK failed to initialize properly");
  }

  return window.FB;
}

/**
 * Function to check if FB SDK is ready
 */
export function isFacebookSDKReady(): boolean {
  return typeof window.FB !== "undefined" && window.fbSDKInitialized === true;
}
