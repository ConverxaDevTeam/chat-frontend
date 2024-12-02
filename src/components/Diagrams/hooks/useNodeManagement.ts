import { useCallback } from "react";
import { useReactFlow, Node, Edge, Position } from "@xyflow/react";

export const useNodeManagement = () => {
  const {
    addNodes,
    setNodes,
    getNodes,
    getNode,
    fitBounds,
    addEdges,
    getNodesBounds,
  } = useReactFlow();

  const addFunctionNode = useCallback(
    (sourceNodeId: string) => {
      // Obtener el nodo fuente y todos los nodos
      const sourceNode = getNode(sourceNodeId);
      const nodes = getNodes();
      if (!sourceNode) return;

      // Encontrar el último nodo función conectado a este agente
      const connectedFunctionNodes = nodes.filter(
        node =>
          node.type === "funcion" && node.data.parentNodeId === sourceNodeId
      );

      // Calcular la posición del nuevo nodo
      const offset = 200; // Espacio entre nodos
      const verticalSpacing = 150; // Espacio vertical entre nodos función

      const position = {
        x: sourceNode.position.x + (sourceNode.width || 0) + offset,
        y:
          sourceNode.position.y +
          connectedFunctionNodes.length * verticalSpacing,
      };

      // Deseleccionar todos los nodos
      setNodes(nodes => nodes.map(node => ({ ...node, selected: false })));

      // Crear el nuevo nodo
      const newNodeId = `function-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: "funcion",
        position,
        data: {
          name: "Nueva Función",
          description: "Función personalizada",
          parentNodeId: sourceNodeId,
        },
        selected: true,
        dragging: true,
      };

      // Crear el edge que conecta el agente con la función
      const newEdge: Edge = {
        id: `e${sourceNodeId}-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        type: "smoothstep",
        sourceHandle: `node-source-${Position.Right}`,
        targetHandle: `node-target-${Position.Left}`,
      };

      // Agregar el nuevo nodo y el edge
      addNodes(newNode);
      addEdges(newEdge);

      // Calcular los bounds incluyendo el nuevo nodo
      const updatedNodes = [...nodes, newNode as Node];
      const bounds = getNodesBounds(updatedNodes);

      // Expandir los bounds para dar espacio alrededor
      const expandedBounds = {
        x: bounds.x - 50,
        y: bounds.y - 50,
        width: bounds.width + 100,
        height: bounds.height + 100,
      };

      // Ajustar la vista para mostrar todos los nodos
      fitBounds(expandedBounds, {
        duration: 500,
        padding: 0.1,
      });
    },
    [addNodes, setNodes, getNodes, getNode, fitBounds, addEdges]
  );

  return {
    addFunctionNode,
  };
};
