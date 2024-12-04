import { useCallback } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { nanoid } from "nanoid";
import {
  FunctionNodeData,
  FunctionNodeTypes,
  HttpRequestFunction,
} from "@interfaces/functions.interface";

interface ContextMenuState {
  x: number;
  y: number;
  fromNode: {
    id: string;
    type: string;
    data: {
      agentId: number;
    };
  };
}

type NodeCreationProps = {
  currentAgentId: number | undefined;
  setContextMenu: (value: ContextMenuState | null) => void;
};

export const useNodeCreation = ({ setContextMenu }: NodeCreationProps) => {
  const { screenToFlowPosition, setNodes, setEdges } = useReactFlow();

  const handleCreateFunction = useCallback(
    (contextMenu: ContextMenuState) => {
      if (!contextMenu) throw new Error("No se ha seleccionado un nodo");

      const { fromNode } = contextMenu;
      // Usamos el agentId del nodo seleccionado en lugar del estado global
      const agentId = fromNode.data.agentId;
      if (!agentId)
        throw new Error("El nodo seleccionado no tiene un agente asignado");

      const newNodeId = `funcion-${nanoid()}`;
      const flowPosition = screenToFlowPosition({
        x: contextMenu.x,
        y: contextMenu.y,
      });

      const newNode: FunctionNodeData<HttpRequestFunction> = {
        id: newNodeId,
        type: "funcion",
        position: flowPosition,
        data: {
          name: "Nueva Función",
          description: "",
          label: "Nueva Función",
          agentId: agentId,
          type: FunctionNodeTypes.API_ENDPOINT,
          config: {
            url: undefined,
            method: undefined,
            requestBody: undefined,
          },
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
    [screenToFlowPosition, setEdges, setNodes, setContextMenu]
  );

  return {
    handleCreateFunction,
  };
};
