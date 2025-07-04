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
        <div className="flex items-center gap-[10px]">
          <img src="/mvp/square-pen.svg" alt="Editar" className="w-4 h-4" />
          <span className="text-[#001126] text-[14px] font-[500] leading-normal">
            Editar agente
          </span>
        </div>
      ),
      onClick: () => setEventOpen(ActionType.EDIT_AGENT),
    },
    {
      child: (
        <div className="flex items-center gap-[10px]">
          <img src="/mvp/parentheses.svg" alt="Agregar" className="w-4 h-4" />
          <span className="text-[#001126] text-[14px] font-[500] leading-normal">
            Agregar función
          </span>
        </div>
      ),
      onClick: () => setEventOpen(ActionType.ADD_FUNCTION),
    },
    {
      child: (
        <div className="flex items-center gap-[10px]">
          <img
            src="/mvp/square-library.svg"
            alt="Documento"
            className="w-4 h-4"
          />
          <span className="text-[#001126] text-[14px] font-[500] leading-normal">
            Agregar documento
          </span>
        </div>
      ),
      onClick: () => setEventOpen(ActionType.ADD_DOCUMENT),
    },
    {
      child: (
        <div className="relative flex items-center gap-[10px]">
          <img
            src="/mvp/bot.svg"
            alt={
              humanCommunication
                ? "Desactivar comunicación"
                : "Activar comunicación"
            }
            className="w-4 h-4"
          />
          <div className="text-[#001126] text-[14px] font-[500] leading-normal flex items-center gap-[5px] relative">
            <span>Escalar a agente humano</span>
            <div className="group relative inline-block">
              <img 
                src="/mvp/Vector.svg" 
                alt="Info" 
                className="cursor-pointer"
              />
              <div className="absolute z-50 invisible group-hover:visible bg-[#F6F6F6] border border-[#001126] text-[#001126] text-[12px] px-2 py-1.5 rounded font-[400] whitespace-normal tracking-[0.17px] leading-[143%] text-left w-[178px] top-0 left-6">
                Permite que la IA derive la conversación a un agente humano en tiempo real.
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={humanCommunication}
              onChange={handleHumanCommunicationToggle}
            />
            <div className="w-9 h-5 bg-gray-300 peer-checked:bg-[#001126] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
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
          description: "Agente conversacional",
          style: NodeStyle.CENTRAL,
        }}
        icon={
          <div className="flex flex-col items-center">
            <img src="/icon.svg" alt="Agente" className="w-10 h-10" />
            <span className="text-[10px]">Agente</span>
          </div>
        }
        contextMenuOptions={contextMenuOptions}
        contextMenuVersion="v2"
        allowedConnections={["source", "target"]}
      />

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
