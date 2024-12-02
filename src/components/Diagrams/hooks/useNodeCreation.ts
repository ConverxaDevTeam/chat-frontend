import { useCallback } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { nanoid } from "nanoid";
import { CustomNodeProps } from "@interfaces/workflow";
interface ContextMenuState {
  x: number;
  y: number;
  fromNode: {
    id: string;
    type: string;
    data: {
      agentId: string;
    };
  };
}

type NodeCreationProps = {
  currentAgentId: number | undefined;
  setContextMenu: (value: ContextMenuState | null) => void;
};

export const useNodeCreation = ({
  currentAgentId,
  setContextMenu,
}: NodeCreationProps) => {
  const { screenToFlowPosition, setNodes, setEdges } = useReactFlow();

  const handleCreateFunction = useCallback(
    (contextMenu: ContextMenuState) => {
      if (!contextMenu) return;

      const { fromNode } = contextMenu;
      const newNodeId = `funcion-${nanoid()}`;
      const flowPosition = screenToFlowPosition({
        x: contextMenu.x,
        y: contextMenu.y,
      });

      const newNode: CustomNodeProps = {
        id: newNodeId,
        type: "funcion",
        position: flowPosition,
        data: {
          name: "Nueva Función",
          description: "",
          label: "Nueva Función",
          agentId: currentAgentId,
        },
      };

      const newEdge: EdgeBase = {
        id: `e${fromNode.id}-${newNodeId}`,
        source: fromNode.id,
        target: newNodeId,
        sourceHandle: `node-source-${Position.Right}`,
        targetHandle: `node-target-${Position.Left}`,
      };

      setNodes(nds => [...nds, newNode]);
      setEdges(eds => [...eds, newEdge]);
      setContextMenu(null);
    },
    [currentAgentId, screenToFlowPosition, setEdges, setNodes, setContextMenu]
  );

  return {
    handleCreateFunction,
  };
};
