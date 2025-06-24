import { IntegrationType } from "@interfaces/integrations";
import { IIntegration } from "./IntegracionesNode";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

interface ButtonIntegrationActiveProps {
  integration: IIntegration;
}

const ButtonIntegrationActive = ({
  integration,
}: ButtonIntegrationActiveProps) => {
  return (
    <button
      title="Integración activa"
      type="button"
      className="flex gap-[6px] items-center justify-center h-[40px] rounded-md bg-blue-300 hover:bg-blue-100 w-full"
    >
      {integration.type === IntegrationType.WHATSAPP && (
        <>
          <BsWhatsapp className="w-5 h-5" />
          <p>Whatsapp</p>
        </>
      )}
      {integration.type === IntegrationType.MESSENGER && (
        <>
          <FaFacebook className="w-5 h-5" />
          <p>Messenger</p>
        </>
      )}
    </button>
  );
};

export default ButtonIntegrationActive;
