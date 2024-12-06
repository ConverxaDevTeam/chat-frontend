import { useUnifiedNodeCreation } from "@components/Diagrams/hooks/useUnifiedNodeCreation";
import { addEdge, Connection } from "@xyflow/react";
import { EdgeBase, NodeBase } from "@xyflow/system";
import { useCallback, useEffect } from "react";

export const useEdges = (
  setEdges: React.Dispatch<React.SetStateAction<EdgeBase[]>>
) => {
  const { createEdge } = useUnifiedNodeCreation(); // Use the hook

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = createEdge(params);
      setEdges(currentEdges => addEdge(newEdge, currentEdges));
    },
    [setEdges, createEdge]
  );

  return { onConnect };
};

export const useZoomToFit = (
  nodes: NodeBase[],
  setCenter: (
    x: number,
    y: number,
    options: { duration: number; zoom: number }
  ) => void
) => {
  useEffect(() => {
    if (nodes.length === 0) return;
    if (nodes.some(node => !node.selected)) return;

    const xValues = nodes.map(node => node.position.x);
    const yValues = nodes.map(node => node.position.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setCenter(centerX, centerY, { duration: 0, zoom: 1 });
  }, [nodes, setCenter]);
};
