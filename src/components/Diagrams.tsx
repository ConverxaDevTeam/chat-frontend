import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  useReactFlow,
  OnConnectEnd,
  NodeProps,
} from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";

import "@xyflow/react/dist/style.css";
import IntegracionesNode from "./Diagrams/IntegracionesNode";
import AgenteNode from "./Diagrams/AgenteNode";
import FuncionNode from "./Diagrams/FuncionNode";
import { useEdges, useZoomToFit } from "./workspace/hooks/Diagrams";
import { useAppSelector } from "@store/hooks";
import { CustomNodeProps } from "@interfaces/workflow";
import ContextMenu from "./ContextMenu";
import { nanoid } from "nanoid";

const initialNodes: CustomNodeProps[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      title: "A",
      name: "Node A",
      description: "This is Node A",
    },
    type: "integraciones",
  },
  {
    id: "2",
    data: {
      title: "",
      name: "Node B",
      description: "This is Node B",
    },
    type: "agente",
    position: { x: 500, y: 0 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: `node-source-${Position.Right}`,
    targetHandle: `node-target-${Position.Left}`,
  },
];

// Node types defined outside of any component
const nodeTypes = {
  integraciones: IntegracionesNode,
  agente: AgenteNode,
  funcion: FuncionNode,
};

const ZoomTransition = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<EdgeBase>(initialEdges);
  const { setCenter, screenToFlowPosition } = useReactFlow();
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    fromNode: NodeProps & Record<string, unknown>;
  } | null>(null);

  const { onConnect } = useEdges(setEdges);

  useZoomToFit(nodes, setCenter);

  const handleConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (
        !connectionState.isValid &&
        connectionState.fromNode?.type === "agente"
      ) {
        const { clientX, clientY } =
          event instanceof MouseEvent ? event : event.touches[0];

        // Explicitly convert InternalNodeBase to NodeProps
        const fromNodeProps: NodeProps = {
          id: connectionState.fromNode.id,
          type: connectionState.fromNode.type,
          data: connectionState.fromNode.data,
          isConnectable: true, // Add this with a default value
          positionAbsoluteX: connectionState.fromNode.position.x ?? 0, // Add this with a fallback
          positionAbsoluteY: connectionState.fromNode.position.y ?? 0, // Add this with a fallback
          dragging: connectionState.fromNode.dragging ?? false,
          zIndex: connectionState.fromNode.zIndex ?? 0,
        };

        setContextMenu({
          x: clientX,
          y: clientY,
          fromNode: fromNodeProps,
        });
      }
    },
    []
  );

  const handleCreateFunction = useCallback(() => {
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
  }, [contextMenu, currentAgentId, screenToFlowPosition, setEdges, setNodes]);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={handleConnectEnd}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        >
          <button
            onClick={handleCreateFunction}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
          >
            Crear Función
          </button>
        </ContextMenu>
      )}
    </div>
  );
};

export default function Diagram() {
  return <ZoomTransition />;
}
