import { FaSlack } from "react-icons/fa";
import ButtonIntegracion from "./ButtonIntegracion";
import ButtonWhatsAppIntegration from "./ButtonWhatsAppIntegration";
import ButtonMessagerIntegration from "./ButtonMessagerIntegration";

interface NewIntegrationProps {
  setIsMenuVisible: (value: boolean) => void;
  getDataIntegrations: () => void;
  departmentId: number | null;
}

const NewIntegration = ({
  setIsMenuVisible,
  getDataIntegrations,
  departmentId,
}: NewIntegrationProps) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-[10px]">
        <ButtonWhatsAppIntegration
          getDataIntegrations={getDataIntegrations}
          departmentId={departmentId}
        />
        <ButtonMessagerIntegration
          getDataIntegrations={getDataIntegrations}
          departmentId={departmentId}
          close={() => setIsMenuVisible(false)}
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
