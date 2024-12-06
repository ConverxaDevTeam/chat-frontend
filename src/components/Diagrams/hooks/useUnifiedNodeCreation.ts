import { useCallback } from "react";
import { Position, useReactFlow, Node, Edge } from "@xyflow/react";
import { nanoid } from "nanoid";
import {
  FunctionNodeData,
  FunctionNodeTypes,
  HttpRequestFunction,
} from "@interfaces/functions.interface";
import { useAppSelector } from "@store/hooks";

interface Position2D {
  x: number;
  y: number;
}

interface CreateNodeOptions {
  position: Position2D;
  agentId: number;
  sourceNodeId?: string;
  parentNodeId?: string;
  initialData?: Partial<FunctionNodeData<HttpRequestFunction>>;
  type?: string;
}

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
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);

  // Función base para crear nodos
  const createNode = useCallback(
    ({
      position,
      agentId,
      sourceNodeId,
      parentNodeId,
      initialData = {},
      type = "funcion",
    }: CreateNodeOptions) => {
      const newNodeId = `${type}-${nanoid()}`;

      // Crear el nuevo nodo
      const newNode: Node<FunctionNodeData<HttpRequestFunction>> = {
        id: newNodeId,
        type,
        position,
        data: {
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

      // Si hay un nodo fuente, crear el edge
      let newEdge: Edge | undefined;
      if (sourceNodeId) {
        newEdge = {
          id: `e${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          type: sourceNodeId === "agent" ? "auth" : undefined,
          sourceHandle: `node-source-${Position.Right}`,
          targetHandle: `node-target-${Position.Left}`,
        };
      }

      return { node: newNode, edge: newEdge };
    },
    []
  );

  // Crear nodo desde el menú contextual
  const createFromContextMenu = useCallback(
    (contextMenu: {
      x: number;
      y: number;
      fromNode: { id: string; data: { agentId: number } };
    }) => {
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
    },
    [createNode, screenToFlowPosition, setNodes, setEdges]
  );

  // Crear nodo con espaciado automático
  const createWithSpacing = useCallback(
    (sourceNodeId: string) => {
      if (!currentAgentId) return;

      const sourceNode = getNode(sourceNodeId);
      const nodes = getNodes();
      if (!sourceNode) return;

      // Calcular posición con espaciado
      const connectedNodes = nodes.filter(
        node =>
          node.type === "funcion" && node.data.parentNodeId === sourceNodeId
      );

      const position = {
        x: sourceNode.position.x + (sourceNode.width || 0) + 200,
        y: sourceNode.position.y + connectedNodes.length * 300,
      };

      const { node, edge } = createNode({
        position,
        agentId: currentAgentId,
        sourceNodeId,
        parentNodeId: sourceNodeId,
      });

      // Agregar nodo y edge
      addNodes(node);
      if (edge) addEdges(edge);

      // Ajustar vista
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
    },
    [
      currentAgentId,
      getNode,
      getNodes,
      createNode,
      addNodes,
      addEdges,
      getNodesBounds,
      fitBounds,
    ]
  );

  // Crear nodo desde el diagrama
  const createFromDiagram = useCallback(
    (
      position: Position2D,
      agentId: number,
      initialData?: Partial<FunctionNodeData<HttpRequestFunction>>
    ) => {
      const { node } = createNode({
        position,
        agentId,
        initialData,
      });

      setNodes(nodes => [...nodes, node]);
      return { node };
    },
    [createNode, setNodes]
  );

  return {
    createNode,
    createFromContextMenu,
    createWithSpacing,
    createFromDiagram,
  };
};
