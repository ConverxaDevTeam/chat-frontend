import { Fragment, memo, useState } from "react";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, NodeStyle } from "@interfaces/workflow";
import { NodeData } from "@interfaces/workflow";
import { IntegrationType } from "@interfaces/integrations";
import AddWebchat from "@pages/Workspace/components/AddWebChat";
import RemoveIntegration from "@pages/Workspace/components/RemoveIntegration";
import SlackIntegration from "@pages/Workspace/components/SlackIntegration";
import MessengerManualIntegration from "@pages/Workspace/components/MessengerManualIntegration";

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
    [IntegrationType.MESSENGER_MANUAL]: "/mvp/messenger.svg",
    [IntegrationType.SLACK]: "/mvp/slack.svg",
  };
  return iconMap[type] || "/mvp/globe.svg";
};

const getIntegrationName = (type: IntegrationType) => {
  const nameMap: Record<IntegrationType, string> = {
    [IntegrationType.CHAT_WEB]: "Chat Web",
    [IntegrationType.WHATSAPP]: "WhatsApp",
    [IntegrationType.MESSENGER]: "Messenger",
    [IntegrationType.MESSENGER_MANUAL]: "Messenger",
    [IntegrationType.SLACK]: "Slack",
  };
  return nameMap[type] || type;
};

export const contextMenuOptions = ({
  setIsModalOpen,
  itemType,
  setIsRemoveModalOpen,
  setIsSlackModalOpen,
  setMessengerManualModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemType: IntegrationType;
  setIsRemoveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSlackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessengerManualModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const choices = [];
  if (itemType === IntegrationType.SLACK) {
    choices.push({
      child: <img src="/mvp/pencil.svg" alt="slack" />,
      onClick: () => setIsSlackModalOpen(true),
    });
  }
  if (itemType === IntegrationType.MESSENGER_MANUAL) {
    choices.push({
      child: <img src="/mvp/settings.svg" alt="messenger" />,
      onClick: () => setMessengerManualModalOpen(true),
    });
  }
  if (itemType === IntegrationType.CHAT_WEB) {
    choices.push({
      child: <img src="/mvp/globe.svg" alt="Webchat" />,
      onClick: () => setIsModalOpen(true),
    });
  } else if (
    itemType === IntegrationType.MESSENGER ||
    itemType === IntegrationType.WHATSAPP ||
    itemType === IntegrationType.SLACK ||
    itemType === IntegrationType.MESSENGER_MANUAL
  ) {
    choices.push({
      child: <img src="/mvp/trash.svg" alt="Remove" />,
      onClick: () => setIsRemoveModalOpen(true),
    });
  }
  return choices;
};

const IntegrationItemNode = memo((props: IntegrationItemProps) => {
  const { data } = props;
  const type = data.type || IntegrationType.CHAT_WEB;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [isSlackModalOpen, setIsSlackModalOpen] = useState<boolean>(false);
  const [messengerManualModalOpen, setMessengerManualModalOpen] =
    useState<boolean>(false);
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
          setIsRemoveModalOpen,
          setIsSlackModalOpen,
          setMessengerManualModalOpen,
        })}
      />
      <AddWebchat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RemoveIntegration
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        data={data}
      />
      {isSlackModalOpen && (
        <SlackIntegration
          isOpen={isSlackModalOpen}
          onClose={() => setIsSlackModalOpen(false)}
          data={data}
        />
      )}
      {messengerManualModalOpen && (
        <MessengerManualIntegration
          isOpen={messengerManualModalOpen}
          onClose={() => setMessengerManualModalOpen(false)}
          data={data}
        />
      )}
    </Fragment>
  );
});

export default IntegrationItemNode;
