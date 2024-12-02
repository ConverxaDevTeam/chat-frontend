import { useCallback } from "react";
import { Node, useReactFlow } from "@xyflow/react";

export const useNodeSelection = () => {
  const { getNodes, setNodes } = useReactFlow();

  const handleNodeDragStart = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // When a node starts being dragged, reduce opacity of other nodes
      const nodes = getNodes();
      setNodes(
        nodes.map(n => ({
          ...n,
          style: n.id !== node.id ? { ...n.style, opacity: 0.3 } : n.style,
        }))
      );
    },
    [getNodes, setNodes]
  );

  const handleNodeDragStop = useCallback(() => {
    // When dragging stops, restore opacity of all nodes
    const nodes = getNodes();
    setNodes(
      nodes.map(n => ({
        ...n,
        style: { ...n.style, opacity: 1 },
      }))
    );
  }, [getNodes, setNodes]);

  return {
    handleNodeDragStart,
    handleNodeDragStop,
  };
};
