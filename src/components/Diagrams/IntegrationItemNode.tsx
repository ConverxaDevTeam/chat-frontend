import { Fragment, memo, useState } from "react";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, NodeStyle } from "@interfaces/workflow";
import { NodeData } from "@interfaces/workflow";
import { IntegrationType } from "@interfaces/integrations";
import AddWebchat from "@pages/Workspace/components/AddWebChat";

interface IntegrationItemProps extends CustomTypeNodeProps<NodeData> {
  data: NodeData & {
    type?: IntegrationType;
  };
}

const getIntegrationIcon = (type: IntegrationType) => {
  const iconMap: Record<IntegrationType, string> = {
    [IntegrationType.CHAT_WEB]: "/mvp/globe.svg",
    [IntegrationType.WHATSAPP]: "/mvp/whatsapp.svg",
    [IntegrationType.MESSENGER]: "/mvp/messenger.svg",
  };
  return iconMap[type] || "/mvp/globe.svg";
};

const getIntegrationName = (type: IntegrationType) => {
  const nameMap: Record<IntegrationType, string> = {
    [IntegrationType.CHAT_WEB]: "Chat Web",
    [IntegrationType.WHATSAPP]: "WhatsApp",
    [IntegrationType.MESSENGER]: "Messenger",
  };
  return nameMap[type] || type;
};

export const contextMenuOptions = ({
  setIsModalOpen,
  itemType,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemType: IntegrationType;
}) => {
  const choices = [];
  if (itemType === IntegrationType.CHAT_WEB) {
    choices.push({
      child: <img src="/mvp/globe.svg" alt="Webchat" />,
      onClick: () => setIsModalOpen(true),
    });
  }
  return choices;
};

const IntegrationItemNode = memo((props: IntegrationItemProps) => {
  const { data } = props;
  const type = data.type || IntegrationType.CHAT_WEB;

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Fragment>
      <DefaultNode
        {...props}
        data={{
          ...data,
          name: getIntegrationName(type),
          description: "Integración",
          style: NodeStyle.SMALL,
        }}
        icon={
          <img
            src={getIntegrationIcon(type)}
            alt={type}
            className="w-6 h-6 shrink-0 text-sofia-superDark"
          />
        }
        allowedConnections={["source"]}
        contextMenuOptions={contextMenuOptions({
          setIsModalOpen,
          itemType: type,
        })}
      />
      <AddWebchat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Fragment>
  );
});

export default IntegrationItemNode;
