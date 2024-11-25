import { addEdge, Connection, Edge, EdgeTypes, OnSelectionChangeFunc, Position } from '@xyflow/react';
import { EdgeBase } from '@xyflow/system';
import { useState, useEffect, useCallback } from 'react';

interface INodeData {
  title: string;
  name: string;
  description: string;
  isSelected: boolean;
}

interface INode {
  id: string;
  position: { x: number; y: number };
  data: INodeData;
  type: string;
}
export const useNodeSelection = (nodes: INode[], setNodes: Function) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isSelected: node.id === selectedNode,
      },
    }));

    setNodes(updatedNodes);
  }, [selectedNode, nodes, setNodes]);

  const handleSelectionChange: OnSelectionChangeFunc = useCallback((params) => {
    const { nodes } = params;

    if (nodes?.length === 0) {
      setSelectedNode(null);
    } else {
      setSelectedNode(nodes[0].id);
    }
  }, []);

  const clearSelection = useCallback(() => setSelectedNode(null), []);

  return { selectedNode, handleSelectionChange, clearSelection };
};


export const useEdges = (setEdges: Function) => {
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: EdgeBase = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: Position.Left,
        targetHandle: Position.Right,
        type: "smoothstep",
      };
      setEdges((eds: EdgeBase[]) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  return { onConnect };
};



export const useZoomToFit = (nodes: INode[], setCenter: Function) => {
  useEffect(() => {
    const xValues = nodes.map((node) => node.position.x);
    const yValues = nodes.map((node) => node.position.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setCenter(centerX, centerY, { duration: 0, zoom: 1 });
  }, [nodes, setCenter]);
};
