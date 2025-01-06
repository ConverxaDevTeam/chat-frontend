import { useState } from "react";
import {
  AgentData,
  CustomTypeNodeProps,
  NodeStyle,
} from "@interfaces/workflow";
import DefaultNode from "./DefaultNode";
import { ContextMenuOption } from "./DiagramContextMenu";
import { ActionButtons, ActionType } from "./agenteComponents/AgentInfo";
import { useHumanCommunication } from "./hooks/useHumanCommunication";

const AgenteNode = (props: CustomTypeNodeProps<AgentData>) => {
  const { data, selected } = props;
  const [eventOpen, setEventOpen] = useState<string | null>(null);
  const { humanCommunication, handleHumanCommunicationToggle } = useHumanCommunication(data.agentId);

  const contextMenuOptions: ContextMenuOption[] = [
    {
      child: <img src="/mvp/pencil.svg" alt="Editar agente" />,
      onClick: () => setEventOpen(ActionType.EDIT_AGENT),
    },
    {
      child: <img src="/mvp/circle-plus.svg" alt="Agregar función" />,
      onClick: () => setEventOpen(ActionType.ADD_FUNCTION),
    },
    {
      child: <img src="/mvp/book-plus.svg" alt="Agregar documento" />,
      onClick: () => setEventOpen(ActionType.ADD_DOCUMENT),
    },
    {
      child: (
        <img
          src={`/mvp/${humanCommunication ? "headset" : "headphone-off"}.svg`}
          alt="Enviar a agente humano"
        />
      ),
      onClick: handleHumanCommunicationToggle,
    },
  ];

  return (
    <>
      <DefaultNode
        {...props}
        data={{
          ...data,
          name: "Agente",
          description: "Agente conversacional",
          style: NodeStyle.CENTRAL,
        }}
        icon={<img src="/icon.svg" alt="Agente" />}
        contextMenuOptions={contextMenuOptions}
        allowedConnections={["source", "target"]}
      ></DefaultNode>
      <ActionButtons
        eventShown={eventOpen}
        onClose={() => setEventOpen(null)}
        agentId={data.agentId}
        nodeId={props.id}
        selected={selected}
      />
    </>
  );
};

export default AgenteNode;
