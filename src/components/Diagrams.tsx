import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { useEffect } from "react";

import "@xyflow/react/dist/style.css";
import IntegracionesNode from "./Diagrams/IntegracionesNode";
import AgenteNode from "./Diagrams/AgenteNode";
import FuncionNode from "./Diagrams/FuncionNode";
import { useEdges, useZoomToFit } from "./workspace/hooks/Diagrams";
import { useAppSelector } from "@store/hooks";
import ContextMenu from "./ContextMenu";
import { useNodeSelection } from "./Diagrams/hooks/useNodeSelection";
import { useContextMenu } from "./Diagrams/hooks/useContextMenu";
import { useNodeCreation } from "./Diagrams/hooks/useNodeCreation";

const createInitialNodes = (agentId?: number) => [
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
      agentId: agentId,
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

const nodeTypes = {
  integraciones: IntegracionesNode,
  agente: AgenteNode,
  funcion: FuncionNode,
} as const;

const ZoomTransition = () => {
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    createInitialNodes(currentAgentId)
  );
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<EdgeBase>(initialEdges);

  useEffect(() => {
    if (!currentAgentId) return;
    setNodes(nodes =>
      nodes.map(node =>
        node.type === "agente"
          ? { ...node, data: { ...node.data, agentId: currentAgentId } }
          : node
      )
    );
  }, [currentAgentId, setNodes]);

  const { handleNodeDragStart, handleNodeDragStop } = useNodeSelection();
  const { contextMenu, setContextMenu, handleConnectEnd } = useContextMenu();
  const { handleCreateFunction } = useNodeCreation({
    currentAgentId,
    setContextMenu,
  });
  const { onConnect } = useEdges(setEdges);
  const { setCenter } = useReactFlow();
  useZoomToFit(nodes, setCenter);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={handleConnectEnd}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
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
            onClick={() => handleCreateFunction(contextMenu)}
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
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);

  if (!currentAgentId) {
    return <div>Cargando...</div>;
  }

  return <ZoomTransition />;
}
