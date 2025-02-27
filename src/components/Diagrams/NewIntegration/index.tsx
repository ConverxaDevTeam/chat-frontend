import ButtonWhatsAppIntegration from "./ButtonWhatsAppIntegration";
import ButtonMessagerIntegration from "./ButtonMessagerIntegration";
import ButtonSlackIntegration from "./ButtonSlackIntegration";

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
      <div className="grid grid-cols-3 gap-[10px] w-[470px]">
        <ButtonWhatsAppIntegration
          getDataIntegrations={getDataIntegrations}
          departmentId={departmentId}
          close={() => setIsMenuVisible(false)}
        />
        <ButtonMessagerIntegration
          getDataIntegrations={getDataIntegrations}
          departmentId={departmentId}
          close={() => setIsMenuVisible(false)}
        />
        <ButtonSlackIntegration
          departmentId={departmentId}
          getDataIntegrations={getDataIntegrations}
          close={() => setIsMenuVisible(false)}
        />
      </div>
    </div>
  );
};

export default NewIntegration;
