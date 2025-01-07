import { memo } from "react";
import DefaultNode from "./DefaultNode";
import { CustomTypeNodeProps, NodeStyle } from "@interfaces/workflow";
import { NodeData } from "@interfaces/workflow";
import { IntegrationType } from "@interfaces/integrations";
import { MdEdit, MdDelete, MdSettings } from "react-icons/md";

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
  onEdit,
  onSettings,
  onDelete,
}: {
  onEdit: () => void;
  onSettings: () => void;
  onDelete: () => void;
}) => [
  {
    child: <MdEdit className="w-5 h-5" />,
    onClick: onEdit,
    tooltip: "Editar integración",
  },
  {
    child: <MdSettings className="w-5 h-5" />,
    onClick: onSettings,
    tooltip: "Configurar integración",
  },
  {
    child: <MdDelete className="w-5 h-5" />,
    onClick: onDelete,
    tooltip: "Eliminar integración",
  },
];

const IntegrationItemNode = memo((props: IntegrationItemProps) => {
  const { data } = props;
  const type = data.type || IntegrationType.CHAT_WEB;

  const handleEdit = () => {
    // TODO: Implementar edición
    console.log("Edit integration", type);
  };

  const handleSettings = () => {
    // TODO: Implementar configuración
    console.log("Settings integration", type);
  };

  const handleDelete = () => {
    // TODO: Implementar eliminación
    console.log("Delete integration", type);
  };

  return (
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
        onEdit: handleEdit,
        onSettings: handleSettings,
        onDelete: handleDelete,
      })}
    />
  );
});

export default IntegrationItemNode;
