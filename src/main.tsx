import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store";
import { CounterProvider } from "@hooks/CounterContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initFacebookSDK } from "./utils/facebook-init";

// Inicializar el SDK de Facebook inmediatamente al cargar la aplicación
// Esto inicia la carga del SDK, pero los componentes esperarán a que esté listo antes de usarlo
console.log("Starting Facebook SDK initialization from main.tsx");
initFacebookSDK()
  .then(() => {
    console.log("Facebook SDK successfully initialized from main.tsx");
  })
  .catch(error => {
    console.error("Error initializing Facebook SDK from main.tsx:", error);
  });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}
  >
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <CounterProvider>
        <Provider store={store}>
          <App />
          <ToastContainer />
        </Provider>
      </CounterProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
