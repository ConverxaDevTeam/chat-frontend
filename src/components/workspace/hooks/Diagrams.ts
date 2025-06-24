import { useUnifiedNodeCreation } from "@components/Diagrams/hooks/useUnifiedNodeCreation";
import { addEdge, Connection } from "@xyflow/react";
import { EdgeBase } from "@xyflow/system";
import { useCallback } from "react";

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
