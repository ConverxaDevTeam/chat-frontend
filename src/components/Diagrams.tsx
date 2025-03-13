import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Position,
  OnNodesChange,
  useReactFlow,
  Node,
  OnConnectEnd,
  OnEdgesChange,
  Connection,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
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
  BodyType,
} from "@/interfaces/functions.interface";
import IntegracionesNode from "./Diagrams/IntegracionesNode";
import AgenteNode from "./Diagrams/AgenteNode";
import FuncionNode from "./Diagrams/FuncionNode";
import IntegrationItemNode from "./Diagrams/IntegrationItemNode";
import ContextMenu from "./ContextMenu";
import { useNodeSelection } from "./Diagrams/hooks/useNodeSelection";
import { useContextMenu } from "./Diagrams/hooks/useContextMenu";
import { useUnifiedNodeCreation } from "./Diagrams/hooks/useUnifiedNodeCreation";
import { useEdges } from "./workspace/hooks/Diagrams";
import { AuthEdge } from "./Diagrams/edges/AuthEdge";
import { FunctionEditModal } from "./Diagrams/funcionComponents/FunctionEditModal";
import { useFunctionSuccess } from "./Diagrams/hooks/useFunctionActions";
import CustomEdge from "./Diagrams/edges/CustomEdge";
import { CustomControls } from "./Diagrams/CustomControls";
import { IntegrationType } from "@interfaces/integrations";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { getWorkspaceData } from "@services/department";
import { useAlertContext } from "./Diagrams/components/AlertContext";
import { useCounter } from "@hooks/CounterContext";

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
type NodeType =
  | "default"
  | "agente"
  | "integraciones"
  | "funcion"
  | "integration-item";

interface Position2D {
  x: number;
  y: number;
}

// Enum para las posiciones disponibles
const NodePositions = {
  positions: [Position.Bottom, Position.Top, Position.Right] as const,
  currentIndex: Number(localStorage.getItem('nodePositionsIndex')) || 0,
  next(isNewNode: boolean = false) {
    if (!isNewNode) {
      return this.positions[this.currentIndex];
    }
    
    const currentPosition = this.positions[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.positions.length;
    localStorage.setItem('nodePositionsIndex', this.currentIndex.toString());
    return currentPosition;
  }
};

const SPECIAL_NODE_IDS = {
  INTEGRATION: '-1'
} as const;

const DEFAULT_POSITIONS = {
  INTEGRATION: Position.Bottom
} as const;

// Gestión de posiciones de nodos
const nodePositionManager = {
  getStoredPosition: (nodeId: string): Position | null => {
    const savedPosition = localStorage.getItem(`node-position-${nodeId}`);
    return savedPosition ? savedPosition as Position : null;
  },

  savePosition: (nodeId: string, position: Position): void => {
    localStorage.setItem(`node-position-${nodeId}`, position);
  },

  getNodePosition: (nodeId: string, isNewNode: boolean = false): Position => {
    if (nodeId === SPECIAL_NODE_IDS.INTEGRATION) {
      return DEFAULT_POSITIONS.INTEGRATION;
    }

    const savedPosition = nodePositionManager.getStoredPosition(nodeId);
    if (savedPosition) {
      return savedPosition;
    }
    
    const position = NodePositions.next(isNewNode);
    nodePositionManager.savePosition(nodeId, position);
    return position;
  }
};

// Factory de nodos
const nodeFactory = {
  createBaseNode: <T extends NodeData>(
    id: string,
    position: Position2D,
    data: T,
    type: NodeType
  ): Node<T> => {
    const nodePosition = nodePositionManager.getNodePosition(id, true);
    return {
      id,
      position,
      data: {
        ...data,
        handlePosition: nodePosition
      },
      type,
      sourcePosition: nodePosition,
      targetPosition: nodePosition === Position.Top ? Position.Bottom : nodePosition === Position.Bottom ? Position.Top : nodePosition === Position.Left ? Position.Right : Position.Left
    };
  },

  createAgentNode: (agentId: number, position: Position2D): Node<AgentData> => {
    const node = nodeFactory.createBaseNode(
      "agent",
      position,
      {
        name: "Node B",
        description: "This is Node B",
        agentId,
      },
      "agente"
    );
    return node;
  },

  createIntegrationsNode: (position: Position2D): Node<NodeData> => {
    const node = nodeFactory.createBaseNode(
      "integrations",
      position,
      {
        name: "Node A",
        description: "This is Node A",
      },
      "integraciones"
    );
    return node;
  },

  createFunctionNode: (
    func: { id: number; name: string },
    position: Position2D,
    agentId: number
  ): Node<FunctionData<HttpRequestFunction>> => {
    const node = nodeFactory.createBaseNode(
      `function-${func.id}`,
      position,
      {
        name: func.name,
        description: "Función del agente",
        agentId,
        functionId: func.id,
        type: FunctionNodeTypes.API_ENDPOINT,
        config: {
          method: HttpMethod.GET,
          url: "",
          requestBody: [],
          bodyType: BodyType.JSON,
        },
      },
      "funcion"
    );
    return node;
  },

  createIntegrationItemNode: (
    id: number,
    position: Position2D,
    type: IntegrationType
  ): Node<NodeData> => {
    const node = nodeFactory.createBaseNode(
      id.toString(),
      position,
      {
        name: type.toString(),
        description: "Integration",
        type,
        id: id,
      } as NodeData,
      "integration-item"
    );
    return node;
  },
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
    type: "default",
  }),

  createAgentFunctionEdge: (
    functionNode: Node<FunctionData<HttpRequestFunction>>,
    authenticatorId?: number
  ): Edge => {
    const isNewNode = !localStorage.getItem(`node-position-${functionNode.id}`);
    const sourcePos = nodePositionManager.getNodePosition(functionNode.id, isNewNode);
    const targetPos = sourcePos === Position.Top ? Position.Bottom : sourcePos === Position.Bottom ? Position.Top : Position.Left;

    return {
      id: `e${functionNode.id}`,
      source: "agent",
      target: functionNode.id,
      sourceHandle: `node-source-${sourcePos}`,
      targetHandle: `node-target-${targetPos}`,
      type: "auth",
      data: {
        functionId: functionNode.data.functionId,
        authenticatorId,
      },
    };
  },
};

interface AgentState {
  agentFunctions: {
    id: number;
    name: string;
    config: {
      position: {
        x: number;
        y: number;
      };
    };
    autenticador?: { id: number };
  }[];
  integrations: Array<{ id: number; type: IntegrationType }>;
}

const createInitialNodes = (
  agentId?: number,
  agentState?: AgentState
): { nodes: Node[]; initialEdges: Edge[] } => {
  // Centramos los nodos iniciales
  const agentNode = nodeFactory.createAgentNode(agentId || 0, {
    x: 400,
    y: 100,
  });
  const integrationsNode = nodeFactory.createIntegrationsNode({
    x: 100,
    y: 100,
  });
  const nodes: Node[] = [integrationsNode, agentNode];

  const agentFunctions = agentState?.agentFunctions || [];
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
    const functionNodes = agentFunctions.reduce<
      Node<FunctionData<HttpRequestFunction>>[]
    >((acc, func) => {
      if (!func.id) return acc;

      // Usar posición guardada si existe, sino calcular nueva posición
      const position =
        func.config?.position ||
        calculateCircularPosition(
          acc,
          agentNode.position
        );

      const node = nodeFactory.createFunctionNode(func, position, agentId);
      return [...acc, node];
    }, []);

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
          node,
          node.data?.functionId
            ? authenticatorsIdsDict[node.data.functionId]
            : undefined
        )
      )
    );
  }

  const integrationsList = agentState?.integrations || [];
  const defaultIntegrations =
    integrationsList.filter(
      integration => integration.type === IntegrationType.CHAT_WEB
    ).length === 0
      ? [{ id: -1, type: IntegrationType.CHAT_WEB }]
      : [...integrationsList];

  if (defaultIntegrations.length > 0) {
    const integrationItemNodes: Node<NodeData>[] = defaultIntegrations.map(
      (integration, index) =>
        nodeFactory.createIntegrationItemNode(
          integration.id,
          calculateTangentialPosition(
            index,
            defaultIntegrations.length,
            { x: 100, y: 100 }
          ),
          integration.type
        )
    );
    nodes.push(...integrationItemNodes);

    // Crear edges desde cada nodo de integración al nodo principal de integración
    initialEdges.push(
      ...integrationItemNodes.map((node: Node<NodeData>) =>
        edgeFactory.createEdge(
          `eI${node.id}`,
          node.id.toString(),
          "integrations",
          `node-source-${Position.Top}`,
          `node-target-${Position.Top}`
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
  <div className="relative w-full h-full">
    <div
      className="absolute inset-0"
    />
    <ReactFlow
      className="relative bg-diagram-gradient"
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
        "integration-item": IntegrationItemNode,
      }}
      edgeTypes={{
        auth: AuthEdge,
        default: CustomEdge,
      }}
      defaultEdgeOptions={{
        type: "default",
      }}
      style={{
        backgroundImage: 'radial-gradient(#DEDEDE 0.6px, transparent 0.8px)',
        backgroundSize: '10px 10px'
      }}
      fitView
    ></ReactFlow>
    <CustomControls />
  </div>
);

const ZoomTransition = ({
  onAgentIdChange,
}: {
  onAgentIdChange: (id: number) => void;
}) => {
  const { count } = useCounter();
  const [agentId, setAgentId] = useState<number | null>(null);
  const departmentId = useSelector(
    (state: RootState) => state.department.selectedDepartmentId
  );

  const [nodesState, setNodesState] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const { handleOperation } = useAlertContext();

  const fetchDepartmentData = async () => {
    try {
      if (!departmentId) return;
      const response = await getWorkspaceData(departmentId);
      const agentState = {
        agentFunctions: response.department.agente.funciones,
        integrations: response.department.integrations,
      };
      if (response.department?.agente?.id) {
        setAgentId(response.department.agente.id);
        onAgentIdChange(response.department.agente.id);
        const { nodes: initialNodes, initialEdges } = createInitialNodes(
          agentId ?? undefined,
          agentState
        );
        setNodesState(initialNodes);
        setEdges(initialEdges);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [departmentId, agentId, count]);

  const reactFlowInstance = useReactFlow();
  const { fitView } = reactFlowInstance;
  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.5, includeHiddenNodes: true });
    }, 10);
  }, [nodesState.length]);

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      setNodesState(nds => applyNodeChanges(changes, nds));
    },
    [setNodesState]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => {
      setEdges(eds => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

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
    },
    handleOperation
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

  return (
    <div className="relative h-full">
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

interface DiagramProps {
  onAgentIdChange: (id: number) => void;
}

export default function Diagram({ onAgentIdChange }: DiagramProps) {
  return <ZoomTransition onAgentIdChange={onAgentIdChange} />;
}

const calculateCircularPosition = (
  existingNodes: Node[],
  centerPosition: { x: number; y: number }
): Position2D => {
  const spacing = 200; 
  const verticalSpacing = 150; 

  // Posicionamiento específico para las primeras 3 funciones
  switch (existingNodes.length) {
    case 0: 
      return {
        x: centerPosition.x,
        y: centerPosition.y + verticalSpacing
      };
    case 1:
      return {
        x: centerPosition.x,
        y: centerPosition.y - verticalSpacing
      };
    case 2:
      return {
        x: centerPosition.x + spacing,
        y: centerPosition.y
      };
    default:
      const col = Math.floor((existingNodes.length - 3) / 2);
      const row = (existingNodes.length - 3) % 2;
      return {
        x: centerPosition.x + spacing + (col * spacing),
        y: centerPosition.y + (row === 0 ? -verticalSpacing : verticalSpacing)
      };
  }
};

const calculateTangentialPosition = (
  index: number,
  total: number,
  sourcePosition: Position2D
): Position2D => {
  const spacing = 150;
  return {
    x: sourcePosition.x - spacing,
    y: sourcePosition.y - spacing / 2 + (index * (spacing / (total - 1 || 1)))
  };
};
