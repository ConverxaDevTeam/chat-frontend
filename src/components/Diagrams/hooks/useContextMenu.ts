import { useCallback, useState } from "react";
import { OnConnectEnd } from "@xyflow/react";
import { AgentData, CustomTypeNodeProps } from "@interfaces/workflow";

type ContextMenuState = {
  x: number;
  y: number;
  fromNode: CustomTypeNodeProps<AgentData>;
} | null;

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (
        connectionState.isValid ||
        connectionState.fromNode?.type !== "agente"
      )
        return;

      const { clientX, clientY } =
        event instanceof MouseEvent ? event : event.touches[0];
      const fromNodeProps = {
        id: connectionState.fromNode.id,
        type: connectionState.fromNode.type,
        data: connectionState.fromNode.data as { agentId: number },
      } as CustomTypeNodeProps<AgentData>;

      setContextMenu({
        x: clientX,
        y: clientY,
        fromNode: fromNodeProps,
      });
    },
    []
  );

  return {
    contextMenu,
    setContextMenu,
    handleConnectEnd,
  };
};
