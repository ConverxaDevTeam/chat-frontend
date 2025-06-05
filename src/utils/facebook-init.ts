// Declaración de tipos para el SDK de Facebook
declare global {
  interface Window {
    fbAsyncInit: () => void;
    fbPromise?: Promise<void>;
    fbInitialized?: boolean;
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
let fbSDKLoaded = false;
let fbSDKInitialized = false;
let loadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;
const LOAD_TIMEOUT = 10000; // 10 seconds timeout

// Inicialización del SDK de Facebook con variables de entorno
export function initFacebookSDK(): Promise<void> {
  // If FB is already defined and initialized, return immediately
  if (typeof window.FB !== "undefined") {
    console.log("Facebook SDK already available in window.FB");
    if (fbSDKInitialized) {
      console.log("Facebook SDK already initialized");
      return Promise.resolve();
    } else {
      console.log(
        "Facebook SDK available but not initialized, initializing now"
      );
      // Initialize the SDK since it's already loaded
      return initializeExistingFBSDK();
    }
  }

  if (fbSDKPromise && fbSDKInitialized) {
    console.log("Facebook SDK already initialized via promise");
    return fbSDKPromise;
  }

  if (fbSDKPromise) {
    console.log("Facebook SDK initialization already in progress");
    return fbSDKPromise;
  }

  console.log("Starting Facebook SDK initialization");
  loadAttempts++;

  fbSDKPromise = new Promise<void>((resolve, reject) => {
    // Set a timeout to detect if the SDK fails to load
    const timeoutId = setTimeout(() => {
      if (!fbSDKInitialized) {
        console.error(
          `Facebook SDK initialization timed out after ${LOAD_TIMEOUT}ms`
        );
        if (loadAttempts < MAX_LOAD_ATTEMPTS) {
          console.log(
            `Retrying Facebook SDK initialization (attempt ${loadAttempts + 1}/${MAX_LOAD_ATTEMPTS})`
          );
          fbSDKPromise = null;
          initFacebookSDK().then(resolve).catch(reject);
        } else {
          reject(
            new Error(
              `Facebook SDK failed to initialize after ${MAX_LOAD_ATTEMPTS} attempts`
            )
          );
        }
      }
    }, LOAD_TIMEOUT);

    // Override the fbAsyncInit function if it hasn't been called yet
    if (!fbSDKLoaded) {
      window.fbAsyncInit = function () {
        console.log("Facebook SDK async init called from initFacebookSDK");
        fbSDKLoaded = true;

        try {
          window.FB.init({
            appId: import.meta.env.VITE_FB_APP_ID,
            autoLogAppEvents: true,
            status: true,
            cookie: true,
            xfbml: true,
            version: "v22.0",
          });

          console.log("Facebook SDK initialized successfully");
          fbSDKInitialized = true;
          window.fbInitialized = true;
          clearTimeout(timeoutId);
          resolve();
        } catch (error) {
          console.error("Error during Facebook SDK initialization:", error);
          clearTimeout(timeoutId);
          reject(error);
        }
      };
    }

    // Check if the script is already in the DOM
    const existingScript = document.getElementById("facebook-jssdk");
    if (existingScript) {
      console.log("Facebook SDK script already exists in DOM");
      // If the script exists but FB is not defined, we're still waiting for it to load
      // The fbAsyncInit function will be called when it's ready
      return;
    }

    // Cargar el SDK de Facebook de manera asíncrona
    try {
      console.log("Loading Facebook SDK script");
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/es_LA/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onerror = error => {
        console.error("Error loading Facebook SDK script:", error);
        clearTimeout(timeoutId);
        reject(new Error("Failed to load Facebook SDK script"));
      };

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
        console.log("Facebook SDK script added to DOM");
      } else {
        document.head.appendChild(script);
        console.log("Facebook SDK script added to head");
      }
    } catch (error) {
      console.error("Error while adding Facebook SDK script to DOM:", error);
      clearTimeout(timeoutId);
      reject(error);
    }
  });

  // Make the promise accessible globally
  window.fbPromise = fbSDKPromise;

  return fbSDKPromise;
}

// Helper function to initialize FB SDK when it's already loaded
function initializeExistingFBSDK(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      console.log("Initializing existing Facebook SDK");
      window.FB.init({
        appId: import.meta.env.VITE_FB_APP_ID,
        autoLogAppEvents: true,
        status: true,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });

      console.log("Existing Facebook SDK initialized successfully");
      fbSDKInitialized = true;
      window.fbInitialized = true;
      resolve();
    } catch (error) {
      console.error("Error initializing existing Facebook SDK:", error);
      reject(error);
    }
  });
}

// Helper function to ensure FB SDK is ready before use
export async function ensureFBSDKLoaded(): Promise<void> {
  console.log("Ensuring Facebook SDK is loaded");

  // If FB is already defined and initialized, return immediately
  if (typeof window.FB !== "undefined" && window.fbInitialized === true) {
    console.log("Facebook SDK already loaded and initialized");
    return Promise.resolve();
  }

  // If there's an existing promise, return it
  if (fbSDKPromise) {
    console.log("Waiting for existing Facebook SDK initialization to complete");
    return fbSDKPromise;
  }

  // Otherwise start the initialization process
  console.log("Starting new Facebook SDK initialization");
  return initFacebookSDK();
}

// Function to check if FB SDK is ready
export function isFacebookSDKReady(): boolean {
  return typeof window.FB !== "undefined" && fbSDKInitialized;
}
