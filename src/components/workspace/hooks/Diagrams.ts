import { CustomNodeProps } from "@interfaces/workflow";
import { addEdge, Connection } from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { useCallback, useEffect } from "react";

export const useEdges = (
  setEdges: React.Dispatch<React.SetStateAction<EdgeBase[]>>
) => {
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: EdgeBase = {
        id: `e${params.source}-${params.target}`,
        source: params.source ?? "",
        target: params.target ?? "",
        sourceHandle: params.sourceHandle ?? undefined,
        targetHandle: params.targetHandle ?? undefined,
      };
      setEdges(currentEdges => addEdge(newEdge, currentEdges));
    },
    [setEdges]
  );

  return { onConnect };
};

export const useZoomToFit = (
  nodes: CustomNodeProps[],
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
