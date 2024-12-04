import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  useReactFlow,
  Node,
  OnNodesChange,
  OnConnectEnd,
  OnEdgesChange,
  Connection,
  Edge,
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
import { NodeData, AgentData } from "@/interfaces/workflow";

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

interface DiagramContextMenuProps {
  contextMenu: ContextMenuState | null;
  onClose: () => void;
  onCreateFunction: (contextMenu: ContextMenuState) => void;
}

interface DiagramFlowProps {
  nodes: Node[];
  edges: EdgeBase[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: Connection) => void;
  onConnectEnd: OnConnectEnd;
  onNodeDragStart: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void;
}

const createInitialNodes = (
  agentId?: number
): { nodes: Node[]; initialEdges: Edge[] } => {
  const agentNode: Node<AgentData> = {
    id: "agent",
    data: {
      name: "Node B",
      description: "This is Node B",
      agentId: agentId || 0,
    },
    type: "agente",
    position: { x: 500, y: 0 },
  };

  const integracionesNode: Node<NodeData> = {
    id: "integrations",
    position: { x: 0, y: 0 },
    data: {
      name: "Node A",
      description: "This is Node A",
    },
    type: "integraciones",
  };

  const nodes: Node[] = [integracionesNode, agentNode];

  // Obtener las funciones del agente del estado de Redux
  const agentFunctions = useAppSelector(state => state.chat.agentFunctions);

  // Si hay funciones y un agentId, crear los nodos de funciones
  if (agentFunctions?.length > 0 && agentId) {
    const functionNodes = agentFunctions
      .map((func, index) => {
        if (!func.id) return null;

        // Calcular el ángulo para cada nodo en casi todo el círculo (300 grados)
        const startAngle = (-5 * Math.PI) / 6;
        const endAngle = (5 * Math.PI) / 6;
        const angleRange = endAngle - startAngle;
        const angleStep = angleRange / (agentFunctions.length - 1 || 1);
        const angle = startAngle + index * angleStep;

        // Radio del semicírculo
        const radius = 300;

        // Calcular posición usando coordenadas polares
        const x = agentNode.position.x + radius * Math.cos(angle);
        const y = agentNode.position.y + radius * Math.sin(angle);

        const functionNode: Node = {
          id: `function-${func.id}`,
          type: "funcion",
          position: { x, y },
          data: {
            name: `Función \n ${func.name}`,
            description: "Función del agente",
            agentId: agentId,
            functionId: func.id,
          },
        };

        return functionNode;
      })
      .filter((node): node is NonNullable<typeof node> => node !== null);

    nodes.push(...functionNodes);

    // Crear los edges que conectan el agente con sus funciones
    const initialEdges = [
      {
        id: "e1-2",
        source: "integrations",
        target: "agent",
        sourceHandle: `node-source-${Position.Right}`,
        targetHandle: `node-target-${Position.Left}`,
      },
    ];

    initialEdges.push(
      ...functionNodes.map(node => {
        // Calcular el ángulo entre el agente y el nodo de función
        const dx = node.position.x - agentNode.position.x;
        const dy = node.position.y - agentNode.position.y;
        const angle = Math.atan2(dy, dx);

        // Determinar los handles basados en el ángulo
        let sourceHandle, targetHandle;

        // Convertir el ángulo a grados para facilitar las comparaciones
        const degrees = angle * (180 / Math.PI);

        if (degrees >= -45 && degrees < 45) {
          // Derecha
          sourceHandle = `node-source-${Position.Right}`;
          targetHandle = `node-target-${Position.Left}`;
        } else if (degrees >= 45 && degrees < 135) {
          // Abajo
          sourceHandle = `node-source-${Position.Bottom}`;
          targetHandle = `node-target-${Position.Top}`;
        } else if (degrees >= -135 && degrees < -45) {
          // Arriba
          sourceHandle = `node-source-${Position.Top}`;
          targetHandle = `node-target-${Position.Bottom}`;
        } else {
          // Izquierda
          sourceHandle = `node-source-${Position.Left}`;
          targetHandle = `node-target-${Position.Right}`;
        }

        return {
          id: `e-agent-${node.id}`,
          source: "agent",
          target: node.id,
          sourceHandle,
          targetHandle,
        };
      })
    );

    return { nodes, initialEdges };
  }

  return {
    nodes,
    initialEdges: [
      {
        id: "e1-2",
        source: "integrations",
        target: "agent",
        sourceHandle: `node-source-${Position.Right}`,
        targetHandle: `node-target-${Position.Left}`,
      },
    ],
  };
};

const DiagramContextMenu = ({
  contextMenu,
  onClose,
  onCreateFunction,
}: DiagramContextMenuProps) => {
  if (!contextMenu) return null;

  return (
    <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={onClose}>
      <button
        onClick={() => onCreateFunction(contextMenu)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
      >
        Crear Función
      </button>
    </ContextMenu>
  );
};

const DiagramFlow = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectEnd,
  onNodeDragStart,
  onNodeDragStop,
}: DiagramFlowProps) => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    onConnectEnd={onConnectEnd}
    onNodeDragStart={onNodeDragStart}
    onNodeDragStop={onNodeDragStop}
    nodeTypes={{
      integraciones: IntegracionesNode,
      agente: AgenteNode,
      funcion: FuncionNode,
    }}
    fitView
  >
    <Controls />
    <MiniMap />
  </ReactFlow>
);

const ZoomTransition = () => {
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);
  const { nodes, initialEdges } = createInitialNodes(currentAgentId);
  const [nodesState, setNodes, onNodesChange] = useNodesState<Node>(nodes);
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
    setContextMenu,
    currentAgentId,
  });
  const { onConnect } = useEdges(setEdges);
  const { setCenter } = useReactFlow();
  useZoomToFit(nodesState, setCenter);

  return (
    <div className="h-full">
      <DiagramFlow
        nodes={nodesState}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={handleConnectEnd}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
      />
      <DiagramContextMenu
        contextMenu={contextMenu}
        onClose={() => setContextMenu(null)}
        onCreateFunction={handleCreateFunction}
      />
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
