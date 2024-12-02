import { useMemo } from "react";
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
import FuncionNode from "./Diagrams/FuncionNode";
import { useEdges, useZoomToFit } from "./workspace/hooks/Diagrams";
import { useAppSelector } from "@store/hooks";
import { CustomNodeProps } from "@interfaces/workflow";

const initialNodes: CustomNodeProps[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      title: "A",
      name: "Node A",
      description: "This is Node A",
    },
    type: "integraciones",
  },
  {
    id: "2",
    data: {
      title: "",
      name: "Node B",
      description: "This is Node B",
    },
    type: "agente",
    position: { x: 500, y: 0 },
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

// Node types defined outside of any component
const nodeTypes = {
  integraciones: IntegracionesNode,
  agente: AgenteNode,
  funcion: FuncionNode,
};

const ZoomTransition = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setCenter } = useReactFlow();
  const currentAgentId = useAppSelector(state => state.chat.currentAgent?.id);

  const { onConnect } = useEdges(setEdges);

  useZoomToFit(nodes, setCenter);

  // Pass props through the data object instead
  const nodesWithProps = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        agentId: node.type === "agente" ? currentAgentId : undefined,
      },
    }));
  }, [currentAgentId, nodes]);

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
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </>
  );
};

export default function Diagram() {
  return <ZoomTransition />;
}
