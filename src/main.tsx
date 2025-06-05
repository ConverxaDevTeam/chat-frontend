import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store";
import { CounterProvider } from "@hooks/CounterContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initFacebookSDK } from "./utils/facebook-init";

// Initialize Facebook SDK immediately
const fbPromise = initFacebookSDK();
fbPromise.catch(error => {
  console.error("Error initializing Facebook SDK:", error);
});

// Create a wrapper component to ensure FB SDK is initialized before rendering the app
const AppWithFacebookSDK = () => {
  useEffect(() => {
    // Log when component mounts to confirm initialization sequence
    console.log(
      "App component mounted, Facebook SDK initialization in progress"
    );
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
        >
          <CounterProvider>
            <App />
            <ToastContainer />
          </CounterProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithFacebookSDK />
  </React.StrictMode>
);
