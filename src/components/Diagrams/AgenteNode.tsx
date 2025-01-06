import { useState } from "react";
import {
  AgentData,
  CustomTypeNodeProps,
  NodeStyle,
} from "@interfaces/workflow";
import DefaultNode from "./DefaultNode";
import { ContextMenuOption } from "./DiagramContextMenu";
import { ActionButtons, ActionType } from "./agenteComponents/AgentInfo";

const AgenteNode = (props: CustomTypeNodeProps<AgentData>) => {
  const { data } = props;
  const [eventOpen, setEventOpen] = useState<string | null>(null);

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
      child: <img src="/mvp/headset.svg" alt="Enviar a agente humano" />,
      onClick: () => setEventOpen(ActionType.SEND_TO_HUMAN),
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
      />
    </>
  );
};

export default AgenteNode;
