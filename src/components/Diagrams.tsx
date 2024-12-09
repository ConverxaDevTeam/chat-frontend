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
import { useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import { useAppSelector } from "@store/hooks";
import {
  NodeData,
  AgentData,
  CustomTypeNodeProps,
} from "@/interfaces/workflow";
import {
  FunctionData,
  HttpRequestFunction,
  FunctionNodeTypes,
  HttpMethod,
} from "@/interfaces/functions.interface";
import IntegracionesNode from "./Diagrams/IntegracionesNode";
import AgenteNode from "./Diagrams/AgenteNode";
import FuncionNode from "./Diagrams/FuncionNode";
import ContextMenu from "./ContextMenu";
import { useNodeSelection } from "./Diagrams/hooks/useNodeSelection";
import { useContextMenu } from "./Diagrams/hooks/useContextMenu";
import { useUnifiedNodeCreation } from "./Diagrams/hooks/useUnifiedNodeCreation";
import { useEdges, useZoomToFit } from "./workspace/hooks/Diagrams";
import { AuthEdge } from "./Diagrams/edges/AuthEdge";
import { FunctionEditModal } from "./Diagrams/funcionComponents/FunctionEditModal";
import { useFunctionSuccess } from "./Diagrams/hooks/useFunctionActions";

// Tipos y interfaces
interface ContextMenuState {
  x: number;
  y: number;
  fromNode: CustomTypeNodeProps<AgentData>;
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

// Tipos para la creación de nodos
type NodeType = "default" | "agente" | "integraciones" | "funcion";

interface Position2D {
  x: number;
  y: number;
}

// Utilidades de posicionamiento
const nodePositioning = {
  calculateCircularPosition: (
    index: number,
    total: number,
    centerPos: Position2D
  ): Position2D => {
    const radius = 300;
    // Ajustamos para que solo use 240 grados (desde -30° hasta 210°)
    // evitando así la zona izquierda donde está la integración
    const startAngle = (-100 * Math.PI) / 180; // -30 grados en radianes
    const endAngle = (210 * Math.PI) / 180; // 210 grados en radianes
    const angleRange = endAngle - startAngle;
    const angleStep = angleRange / (total - 1 || 1);
    const angle = startAngle + index * angleStep;

    return {
      x: centerPos.x + radius * Math.cos(angle),
      y: centerPos.y + radius * Math.sin(angle),
    };
  },

  getHandlePositions: (
    sourcePos: Position2D,
    targetPos: Position2D
  ): { sourceHandle: string; targetHandle: string } => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle >= -45 && angle < 45) {
      return {
        sourceHandle: `node-source-${Position.Right}`,
        targetHandle: `node-target-${Position.Left}`,
      };
    } else if (angle >= 45 && angle < 135) {
      return {
        sourceHandle: `node-source-${Position.Bottom}`,
        targetHandle: `node-target-${Position.Top}`,
      };
    } else if (angle >= -135 && angle < -45) {
      return {
        sourceHandle: `node-source-${Position.Top}`,
        targetHandle: `node-target-${Position.Bottom}`,
      };
    }
    return {
      sourceHandle: `node-source-${Position.Left}`,
      targetHandle: `node-target-${Position.Right}`,
    };
  },
};

// Factory de nodos
const nodeFactory = {
  createBaseNode: <T extends NodeData>(
    id: string,
    position: Position2D,
    data: T,
    type: NodeType
  ): Node<T> => ({
    id,
    position,
    data,
    type,
  }),

  createAgentNode: (agentId: number, position: Position2D): Node<AgentData> =>
    nodeFactory.createBaseNode(
      "agent",
      position,
      {
        name: "Node B",
        description: "This is Node B",
        agentId,
      },
      "agente"
    ),

  createIntegrationsNode: (position: Position2D): Node<NodeData> =>
    nodeFactory.createBaseNode(
      "integrations",
      position,
      {
        name: "Node A",
        description: "This is Node A",
      },
      "integraciones"
    ),

  createFunctionNode: (
    func: { id: number; name: string },
    position: Position2D,
    agentId: number
  ): Node<FunctionData<HttpRequestFunction>> =>
    nodeFactory.createBaseNode(
      `function-${func.id}`,
      position,
      {
        name: `Función \n ${func.name}`,
        description: "Función del agente",
        agentId,
        functionId: func.id,
        type: FunctionNodeTypes.API_ENDPOINT,
        config: {
          method: HttpMethod.GET,
          url: "",
          requestBody: [],
        },
      },
      "funcion"
    ),
};

// Factory de edges
const edgeFactory = {
  createEdge: (
    id: string,
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string
  ): Edge => ({
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
  }),

  createAgentFunctionEdge: (
    agentPos: Position2D,
    functionNode: Node<FunctionData<HttpRequestFunction>>,
    authenticatorId?: number
  ): Edge => {
    const { sourceHandle, targetHandle } = nodePositioning.getHandlePositions(
      agentPos,
      functionNode.position
    );

    return {
      id: `e${functionNode.id}`,
      source: "agent",
      target: functionNode.id,
      sourceHandle,
      targetHandle,
      type: "auth",
      data: {
        functionId: functionNode.data.functionId,
        authenticatorId: authenticatorId,
      },
    };
  },
};

const edgeTypes = {
  auth: AuthEdge,
};

const createInitialNodes = (
  agentId?: number
): { nodes: Node[]; initialEdges: Edge[] } => {
  const agentNode = nodeFactory.createAgentNode(agentId || 0, { x: 500, y: 0 });
  const integrationsNode = nodeFactory.createIntegrationsNode({ x: 0, y: 0 });
  const nodes: Node[] = [integrationsNode, agentNode];

  const agentFunctions = useAppSelector(state => state.chat.agentFunctions);
  const initialEdges: Edge[] = [
    edgeFactory.createEdge(
      "e1-2",
      "integrations",
      "agent",
      `node-source-${Position.Right}`,
      `node-target-${Position.Left}`
    ),
  ];

  if (agentFunctions?.length > 0 && agentId) {
    const functionNodes = agentFunctions
      .map((func, index) => {
        if (!func.id) return null;
        const position = nodePositioning.calculateCircularPosition(
          index,
          agentFunctions.length,
          agentNode.position
        );
        return nodeFactory.createFunctionNode(func, position, agentId);
      })
      .filter(
        (node): node is Node<FunctionData<HttpRequestFunction>> => node !== null
      );

    nodes.push(...functionNodes);
    const authenticatorsIdsDict = agentFunctions
      .filter(func => func.autenticador)
      .reduce(
        (acc, func) => ({ ...acc, [func.id]: func.autenticador!.id }),
        {} as { [key: number]: number }
      );

    initialEdges.push(
      ...functionNodes.map(node =>
        edgeFactory.createAgentFunctionEdge(
          agentNode.position,
          node,
          node.data?.functionId
            ? authenticatorsIdsDict[node.data.functionId]
            : undefined
        )
      )
    );
  }

  return { nodes, initialEdges };
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
    edgeTypes={edgeTypes}
    fitView
  >
    <Controls />
    <MiniMap />
  </ReactFlow>
);

const ZoomTransition = () => {
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);
  const [nodesState, setNodes, onNodesChange] = useNodesState<Node>(
    createInitialNodes(currentAgentId).nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeBase>(
    createInitialNodes(currentAgentId).initialEdges
  );

  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

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
  const { createWithSpacing } = useUnifiedNodeCreation();

  const handleFunctionSuccess = useFunctionSuccess(
    createWithSpacing,
    selectedNodeId,
    selectedAgentId || -1,
    () => {
      setShowFunctionModal(false);
      setSelectedNodeId(null);
    }
  );

  const handleCreateFunction = useCallback(
    (contextMenu: ContextMenuState) => {
      if (!contextMenu.fromNode.data.agentId) {
        console.error("El nodo seleccionado no tiene un agente asignado");
        return;
      }
      setSelectedNodeId(contextMenu.fromNode.id);
      setSelectedAgentId(contextMenu.fromNode.data.agentId);
      setShowFunctionModal(true);
      setContextMenu(null);
    },
    [setContextMenu]
  );

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
      {selectedAgentId && (
        <FunctionEditModal
          isShown={showFunctionModal}
          onClose={() => {
            setShowFunctionModal(false);
            setSelectedNodeId(null);
          }}
          onSuccess={handleFunctionSuccess}
          agentId={selectedAgentId ?? undefined}
        />
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
