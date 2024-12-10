import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaSlack } from "react-icons/fa";
import ButtonIntegracion from "./ButtonIntegracion";

interface NewIntegrationProps {
  setIsMenuVisible: (value: boolean) => void;
}

const NewIntegration = ({ setIsMenuVisible }: NewIntegrationProps) => {
  const handleConnect = () => {
    // FB.login(function (response) {
    //   if (response.authResponse) {
    //     console.log("Welcome!  Fetching your information.... ");
    //     FB.api("/me", function (response) {
    //       console.log("Good to see you, " + response.name + ".");
    //     });
    //   } else {
    //     console.log("User cancelled login or did not fully authorize.");
    //   }
    // });
    FB.login(
      response => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;

          // Enviar el token al backend para configuraciones adicionales
          fetch("http://localhost:3001/api/facebook/facebook-callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken }),
          })
            .then(res => res.json())
            .then(data => {
              console.log("Webhook configurado:", data);
            })
            .catch(err => console.error("Error:", err));
        } else {
          console.log("Permisos no otorgados");
        }
      },
      { scope: "whatsapp_business_messaging,whatsapp_business_management" } // Permisos requeridos
    );
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-[10px]">
        <ButtonIntegracion
          action={handleConnect}
          Icon={BsWhatsapp}
          text="Whatsapp"
        />
        <ButtonIntegracion
          action={() => setIsMenuVisible(false)}
          Icon={FaFacebook}
          text="Messenger"
          disabled
        />
        <ButtonIntegracion
          action={() => setIsMenuVisible(false)}
          Icon={FaSlack}
          text="Slack"
          disabled
        />
      </div>
    </div>
  );
};

export default NewIntegration;
