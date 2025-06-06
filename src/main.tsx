import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store";
import { CounterProvider } from "@hooks/CounterContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initFacebookSDK, isFacebookSDKReady } from "./utils/facebook-init";

// Inicializar el SDK de Facebook inmediatamente al cargar la aplicación
console.log("Iniciando carga del SDK de Facebook desde main.tsx");
const fbPromise = initFacebookSDK();
fbPromise
  .then(() => {
    console.log("SDK de Facebook inicializado exitosamente desde main.tsx");
  })
  .catch(error => {
    console.error(
      "Error al inicializar el SDK de Facebook desde main.tsx:",
      error
    );
  });

// Componente que garantiza que el SDK de Facebook esté inicializado
const AppWithFacebookSDK = () => {
  useEffect(() => {
    // Verificar el estado de inicialización del SDK
    const checkSDKStatus = () => {
      if (isFacebookSDKReady()) {
        console.log("SDK de Facebook listo para su uso en la aplicación");
      } else {
        console.log("Esperando a que el SDK de Facebook esté listo...");
        // Verificar nuevamente en 1 segundo
        setTimeout(checkSDKStatus, 1000);
      }
    };

    // Iniciar verificación
    checkSDKStatus();
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
