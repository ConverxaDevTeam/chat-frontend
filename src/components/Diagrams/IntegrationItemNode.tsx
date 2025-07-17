import { Fragment, memo, useState } from "react";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, NodeStyle } from "@interfaces/workflow";
import { NodeData } from "@interfaces/workflow";
import { IntegrationType } from "@interfaces/integrations";
import AddWebchat from "@pages/Workspace/components/AddWebChat";
import SlackIntegration from "@pages/Workspace/components/SlackIntegration";
import ConfirmationModal from "@components/ConfirmationModal";
import { deleteIntegrationbyId } from "@services/integration";
import MessengerManualIntegration from "@pages/Workspace/components/MessengerManualIntegration";
import WhatsAppManualIntegration from "@pages/Workspace/components/WhatsAppManualIntegration";
import { ContextMenuOption } from "./DiagramContextMenu";
import { useCounter } from "@hooks/CounterContext";

interface IntegrationItemProps extends CustomTypeNodeProps<NodeData> {
  data: NodeData & {
    type?: IntegrationType;
  };
}

const getIntegrationIcon = (type: IntegrationType) => {
  const iconMap: Record<IntegrationType, string> = {
    [IntegrationType.CHAT_WEB]: "/mvp/icon-web-yellow.svg",
    [IntegrationType.WHATSAPP]: "/mvp/whatsapp.svg",
    [IntegrationType.WHATSAPP_MANUAL]: "/mvp/whatsapp.svg",
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
    [IntegrationType.WHATSAPP_MANUAL]: "WhatsApp",
    [IntegrationType.MESSENGER]: "Messenger",
    [IntegrationType.MESSENGER_MANUAL]: "Messenger",
    [IntegrationType.SLACK]: "Slack",
  };
  return nameMap[type] || type;
};

const useIntegrationActions = (data: NodeData) => {
  const { increment } = useCounter();

  const handleDeleteIntegration = async () => {
    if (!data.id) return false;
    const response = await deleteIntegrationbyId(data.id);
    if (response) {
      // Use the counter context to trigger a diagram update instead of page reload
      increment();
      return true;
    }
    return false;
  };

  return {
    handleDeleteIntegration,
  };
};

export const contextMenuOptions = ({
  setIsModalOpen,
  itemType,
  setIsRemoveModalOpen,
  setIsSlackModalOpen,
  setMessengerManualModalOpen,
  setWhatsAppManualModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemType: IntegrationType;
  setIsRemoveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSlackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessengerManualModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWhatsAppManualModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const choices: ContextMenuOption[] = [];
  if (itemType === IntegrationType.SLACK) {
    choices.push({
      child: <img src="/mvp/pencil.svg" alt="slack" className="w-4 h-4" />,
      onClick: () => setIsSlackModalOpen(true),
      tooltip: "Editar integración Slack",
    });
  }
  if (itemType === IntegrationType.MESSENGER_MANUAL) {
    choices.push({
      child: (
        <img src="/mvp/settings.svg" alt="messenger" className="w-4 h-4" />
      ),
      onClick: () => setMessengerManualModalOpen(true),
      tooltip: "Configurar Messenger",
    });
  }
  if (itemType === IntegrationType.WHATSAPP_MANUAL) {
    choices.push({
      child: <img src="/mvp/settings.svg" alt="whatsapp" className="w-4 h-4" />,
      onClick: () => setWhatsAppManualModalOpen(true),
      tooltip: "Configurar WhatsApp",
    });
  }
  if (itemType === IntegrationType.CHAT_WEB) {
    choices.push({
      child: <img src="/mvp/globe.svg" alt="Webchat" className="w-4 h-4" />,
      onClick: () => setIsModalOpen(true),
      tooltip: "Configurar Webchat",
    });
  } else if (
    itemType === IntegrationType.MESSENGER ||
    itemType === IntegrationType.WHATSAPP ||
    itemType === IntegrationType.SLACK ||
    itemType === IntegrationType.MESSENGER_MANUAL ||
    itemType === IntegrationType.WHATSAPP_MANUAL
  ) {
    choices.push({
      child: <img src="/mvp/trash.svg" alt="Remove" />,
      onClick: () => setIsRemoveModalOpen(true),
      tooltip: "Eliminar canal ",
    });
  }
  return choices;
};

const IntegrationItemNode = memo((props: IntegrationItemProps) => {
  const { data } = props;
  const type = data.type || IntegrationType.CHAT_WEB;
  const { handleDeleteIntegration } = useIntegrationActions(data);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [isSlackModalOpen, setIsSlackModalOpen] = useState<boolean>(false);
  const [messengerManualModalOpen, setMessengerManualModalOpen] =
    useState<boolean>(false);
  const [whatsAppManualModalOpen, setWhatsAppManualModalOpen] =
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
            className="w-6 h-6 shrink-0 text-app-superDark"
          />
        }
        allowedConnections={["source"]}
        contextMenuVersion="v2"
        contextMenuOptions={contextMenuOptions({
          setIsModalOpen,
          itemType: type,
          setIsRemoveModalOpen,
          setIsSlackModalOpen,
          setMessengerManualModalOpen,
          setWhatsAppManualModalOpen,
        })}
      />
      <AddWebchat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ConfirmationModal
        isShown={isRemoveModalOpen}
        title="Eliminar canal"
        text="¿Estás seguro de que deseas eliminar este canal?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={async () => {
          const success = await handleDeleteIntegration();
          if (success) {
            setIsRemoveModalOpen(false);
          }
          return success;
        }}
        onClose={() => setIsRemoveModalOpen(false)}
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
      {whatsAppManualModalOpen && (
        <WhatsAppManualIntegration
          isOpen={whatsAppManualModalOpen}
          onClose={() => setWhatsAppManualModalOpen(false)}
          data={data}
        />
      )}
    </Fragment>
  );
});

export default IntegrationItemNode;
