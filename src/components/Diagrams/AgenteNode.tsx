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
  const { humanCommunication, handleHumanCommunicationToggle } =
    useHumanCommunication(data.agentId);

  const contextMenuOptions: ContextMenuOption[] = [
    {
      child: (
        <div className="group relative">
          <img src="/mvp/pencil.svg" alt="Editar agente" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-5 hidden group-hover:block bg-gray-800 text-white text-lm px-2 py-1 rounded whitespace-nowrap">
            Editar agente
          </div>
        </div>
      ),
      onClick: () => setEventOpen(ActionType.EDIT_AGENT),
    },
    {
      child: (
        <div className="group relative">
          <img src="/mvp/circle-plus.svg" alt="Agregar función" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-5 hidden group-hover:block bg-gray-800 text-white text-lm px-2 py-1 rounded whitespace-nowrap">
            Agregar función
          </div>
        </div>
      ),
      onClick: () => setEventOpen(ActionType.ADD_FUNCTION),
    },
    {
      child: (
        <div className="group relative">
          <img src="/mvp/book-plus.svg" alt="Agregar documento" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-5 hidden group-hover:block bg-gray-800 text-white text-lm px-2 py-1 rounded whitespace-nowrap">
            Agregar documento
          </div>
        </div>
      ),
      onClick: () => setEventOpen(ActionType.ADD_DOCUMENT),
    },
    {
      child: (
        <div className="group relative">
          <img
            src={`/mvp/${humanCommunication ? "headset" : "headphone-off"}.svg`}
            alt={
              humanCommunication
                ? "Desactivar comunicación con un agente humano"
                : "Activar comunicación con un agente humano"
            }
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 hidden group-hover:block bg-gray-800 text-white text-lm px-2 py-1 rounded whitespace-nowrap">
          {humanCommunication
          ? "Desactivar comunicación con un agente humano"
          : "Activar comunicación con un agente humano"}
          </div>
        </div>
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
