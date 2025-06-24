import { useCallback } from "react";
import {
  Position,
  useReactFlow,
  Edge,
  Connection,
  Node,
  XYPosition,
  Rect,
} from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { nanoid } from "nanoid";
import {
  FunctionData,
  HttpRequestFunction,
  FunctionNodeTypes,
} from "@interfaces/functions.interface";
import { AgentData, CustomTypeNodeProps } from "@interfaces/workflow";

interface Position2D {
  x: number;
  y: number;
}

interface ContextMenuState {
  x: number;
  y: number;
  fromNode: CustomTypeNodeProps<AgentData>;
}

interface CreateNodeOptions {
  position: Position2D;
  agentId: number;
  sourceNodeId?: string;
  parentNodeId?: string;
  initialData?: Partial<FunctionData<HttpRequestFunction>>;
  type?: string;
}

// Función auxiliar para crear un nuevo nodo
const createNewNode = ({
  position,
  agentId,
  sourceNodeId,
  parentNodeId,
  initialData = {},
  type = "funcion",
}: CreateNodeOptions) => {
  const newNodeId = `${type}-${nanoid()}`;

  return {
    id: newNodeId,
    type,
    position,
    data: {
      ...initialData,
      name: initialData.name || "Nueva Función",
      description: initialData.description || "",
      label: initialData.name || "Nueva Función",
      agentId,
      parentNodeId: parentNodeId || sourceNodeId,
      type: FunctionNodeTypes.API_ENDPOINT,
      config: initialData.config || {
        url: undefined,
        method: undefined,
        requestBody: undefined,
      },
    },
  };
};

// Utilidades de posicionamiento
export const nodePositioning = {
  calculateCircularPosition: (
    existingNodes: Array<{ position: Position2D }>,
    centerPos: Position2D
  ): Position2D => {
    const radius = 300;
    const startAngle = (-100 * Math.PI) / 180; // -30 grados en radianes
    const endAngle = (210 * Math.PI) / 180; // 210 grados en radianes
    const angleRange = endAngle - startAngle;

    // Convertir posiciones de nodos a ángulos
    const nodeAngles = existingNodes
      .map(node => {
        const dx = node.position.x - centerPos.x;
        const dy = node.position.y - centerPos.y;
        let angle = Math.atan2(dy, dx);
        // Normalizar ángulo al rango [startAngle, endAngle]
        if (angle < startAngle) angle += 2 * Math.PI;
        return angle;
      })
      .sort((a, b) => a - b);

    // Si no hay nodos, colocar en el centro del arco
    if (nodeAngles.length === 0) {
      const angle = startAngle + angleRange / 2;
      return {
        x: centerPos.x + radius * Math.cos(angle),
        y: centerPos.y + radius * Math.sin(angle),
      };
    }

    // Encontrar el espacio más grande entre nodos
    let maxGap = nodeAngles[0] - startAngle;
    let bestAngle = startAngle + maxGap / 2;

    for (let i = 0; i < nodeAngles.length - 1; i++) {
      const gap = nodeAngles[i + 1] - nodeAngles[i];
      if (gap > maxGap) {
        maxGap = gap;
        bestAngle = nodeAngles[i] + gap / 2;
      }
    }

    // Verificar el espacio hasta el final del arco
    const lastGap = endAngle - nodeAngles[nodeAngles.length - 1];
    if (lastGap > maxGap) {
      bestAngle = nodeAngles[nodeAngles.length - 1] + lastGap / 2;
    }

    return {
      x: centerPos.x + radius * Math.cos(bestAngle),
      y: centerPos.y + radius * Math.sin(bestAngle),
    };
  },

  calculateTangentialPosition: (
    index: number,
    total: number,
    integrationPos: Position2D,
    agentPos: Position2D
  ): Position2D => {
    // Calculamos el ángulo entre el nodo de integración y el agente
    const dx = agentPos.x - integrationPos.x;
    const dy = agentPos.y - integrationPos.y;
    const baseAngle = Math.atan2(dy, dx);

    // Creamos un arco de 120 grados (-60 a +60 desde la perpendicular)
    const arcRange = (120 * Math.PI) / 180;
    const startAngle = baseAngle - Math.PI / 2 - arcRange / 2;
    const angleStep = arcRange / (total - 1 || 1);

    // Radio para los nodos de integración
    const radius = 150;
    const angle = startAngle + index * angleStep;

    return {
      x: integrationPos.x + radius * Math.cos(angle),
      y: integrationPos.y + radius * Math.sin(angle),
    };
  },
};

// Función auxiliar para crear un nuevo edge
const createNewEdge = (sourceNodeId: string, newNodeId: string) => {
  return {
    id: `e${sourceNodeId}-${newNodeId}`,
    source: sourceNodeId,
    target: newNodeId,
    type: sourceNodeId === "agent" ? "auth" : "default",
    sourceHandle: `node-source-${Position.Top}`,
    targetHandle: `node-target-${Position.Top}`,
  };
};

// Función para crear nodo desde el menú contextual
const handleCreateFromContextMenu = (
  contextMenu: ContextMenuState,
  screenToFlowPosition: (position: XYPosition) => XYPosition,
  createNode: (options: CreateNodeOptions) => { node: Node; edge?: Edge },
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void
) => {
  if (!contextMenu.fromNode.data.agentId) {
    throw new Error("El nodo seleccionado no tiene un agente asignado");
  }

  const flowPosition = screenToFlowPosition({
    x: contextMenu.x,
    y: contextMenu.y,
  });

  const { node, edge } = createNode({
    position: flowPosition,
    agentId: contextMenu.fromNode.data.agentId,
    sourceNodeId: contextMenu.fromNode.id,
  });

  setNodes(nodes => [...nodes, node]);
  if (edge) setEdges(edges => [...edges, edge]);

  return { node, edge };
};

// Lógica para crear nodo con espaciado
const handleCreateWithSpacing = (
  sourceNodeId: string,
  currentAgentId: number | undefined,
  getNode: (id: string) => Node | undefined,
  getNodes: () => Node[],
  createNode: (options: CreateNodeOptions) => { node: Node; edge?: Edge },
  addNodes: (node: Node) => void,
  addEdges: (edge: Edge) => void,
  getNodesBounds: (nodes: Node[]) => Rect,
  fitBounds: (
    bounds: Rect,
    options?: { duration?: number; padding?: number }
  ) => void,
  functionData?: FunctionData<HttpRequestFunction>
) => {
  if (!currentAgentId) return;

  const sourceNode = getNode(sourceNodeId);
  const nodes = getNodes();
  if (!sourceNode) return;

  const connectedNodes = nodes.filter(
    node => node.type === "funcion" && node.data.parentNodeId === sourceNodeId
  );

  const position = nodePositioning.calculateCircularPosition(
    connectedNodes,
    sourceNode.position
  );

  const { node, edge } = createNode({
    position,
    agentId: currentAgentId,
    sourceNodeId,
    parentNodeId: sourceNodeId,
    initialData: functionData,
  });

  addNodes(node);
  if (edge) addEdges(edge);

  const updatedNodes = [...nodes, node];
  const bounds = getNodesBounds(updatedNodes);
  const expandedBounds = {
    x: bounds.x - 50,
    y: bounds.y - 50,
    width: bounds.width + 100,
    height: bounds.height + 100,
  };

  fitBounds(expandedBounds, {
    duration: 500,
    padding: 0.1,
  });

  return { node, edge };
};

// Lógica para crear nodo desde el diagrama
const handleCreateFromDiagram = (
  position: XYPosition,
  agentId: number,
  createNode: (options: CreateNodeOptions) => { node: Node; edge?: Edge },
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void,
  initialData?: Partial<FunctionData<HttpRequestFunction>>
) => {
  const { node } = createNode({
    position,
    agentId,
    initialData,
  });

  setNodes(nodes => [...nodes, node]);
  return { node };
};

export const useUnifiedNodeCreation = () => {
  const {
    screenToFlowPosition,
    setNodes,
    setEdges,
    getNodes,
    getNode,
    fitBounds,
    getNodesBounds,
    addNodes,
    addEdges,
  } = useReactFlow();

  const createNode = useCallback(
    ({
      position,
      agentId,
      sourceNodeId,
      parentNodeId,
      initialData = {},
      type = "funcion",
    }: CreateNodeOptions) => {
      const newNode = createNewNode({
        position,
        agentId,
        sourceNodeId,
        parentNodeId,
        initialData,
        type,
      });
      let newEdge: Edge | undefined;
      if (sourceNodeId) {
        newEdge = createNewEdge(sourceNodeId, newNode.id);
        if (newEdge.type === "auth") {
          newEdge.data = {
            functionId: initialData.functionId ?? initialData.id,
            authenticatorId: undefined,
          };
        }
      }
      return { node: newNode, edge: newEdge };
    },
    []
  );

  const createFromContextMenu = useCallback(
    (contextMenu: ContextMenuState) => {
      return handleCreateFromContextMenu(
        contextMenu,
        screenToFlowPosition,
        createNode,
        setNodes,
        setEdges
      );
    },
    [screenToFlowPosition, createNode, setNodes, setEdges]
  );

  const createWithSpacing = useCallback(
    (
      sourceNodeId: string,
      currentAgentId?: number,
      functionData?: FunctionData<HttpRequestFunction>
    ) => {
      return handleCreateWithSpacing(
        sourceNodeId,
        currentAgentId,
        getNode,
        getNodes,
        createNode,
        addNodes,
        addEdges,
        getNodesBounds,
        fitBounds,
        functionData
      );
    },
    [
      getNode,
      getNodes,
      createNode,
      addNodes,
      addEdges,
      getNodesBounds,
      fitBounds,
    ]
  );

  const createFromDiagram = useCallback(
    (
      position: XYPosition,
      agentId: number,
      initialData?: Partial<FunctionData<HttpRequestFunction>>
    ) => {
      return handleCreateFromDiagram(
        position,
        agentId,
        createNode,
        setNodes,
        initialData
      );
    },
    [createNode, setNodes]
  );

  const createEdge = useCallback((params: Connection) => {
    return {
      id: `e${params.source}-${params.target}`,
      source: params.source ?? "",
      target: params.target ?? "",
      sourceHandle: params.sourceHandle ?? undefined,
      targetHandle: params.targetHandle ?? undefined,
      type: params.source === "agent" ? "auth" : undefined,
    } as EdgeBase;
  }, []);

  return {
    createNode,
    createFromContextMenu,
    createWithSpacing,
    createFromDiagram,
    createEdge,
  };
};
