import { useMemo, memo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Position,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import IntegracionesNode from "./Diagrams/IntegracionesNode";
import AgenteNode from "./Diagrams/AgenteNode";
import { useEdges, useNodeSelection, useZoomToFit } from "./workspace/hooks/Diagrams";
import { useAppSelector } from "@store/hooks";
import { IntegracionesNodeProps } from "@interfaces/workflow";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      title: "A",
      name: "Node A",
      description: "This is Node A",
      isSelected: false,
    },
    type: "integraciones",
  },
  {
    id: "2",
    position: { x: 500, y: 0 },
    data: {
      title: "B",
      name: "Node B",
      description: "This is Node B",
      isSelected: false,
    },
    type: "agente",
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: `node-source-${Position.Right}`,
    targetHandle: `node-target-${Position.Left}`,
  },
];

// Memoized node components
const MemoizedIntegracionesNode = memo(({ data }: Pick<IntegracionesNodeProps, 'data'>) => (
  <IntegracionesNode 
    data={data} 
  />
));

const MemoizedAgenteNode = memo(({ data, agentId }: any) => (
  <AgenteNode data={data} agentId={agentId} />
));

// Node types defined outside of any component
const nodeTypes = {
  integraciones: MemoizedIntegracionesNode,
  agente: MemoizedAgenteNode,
};

const ZoomTransition = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setCenter } = useReactFlow();
  const currentAgentId = useAppSelector((state) => state.chat.currentAgent?.id);

  const { handleSelectionChange, clearSelection } = useNodeSelection(nodes, setNodes);
  const { onConnect } = useEdges(setEdges);

  useZoomToFit(nodes, setCenter);

  // Pass props through the data object instead
  const nodesWithProps = useMemo(() => 
    nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        agentId: node.type === 'agente' ? currentAgentId : undefined,
      }
    })),
    [nodes, currentAgentId]
  );

  return (
    <>
      <ReactFlow
        nodes={nodesWithProps}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={false}
        nodeTypes={nodeTypes}
        onSelectionChange={handleSelectionChange}
        onPaneClick={clearSelection}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </>
  );
};


export default function Diagram() {
  return (
      <ZoomTransition />
  );
}
