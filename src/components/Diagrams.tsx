import { useState, useMemo } from "react";
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
import AddWebchat from "@pages/Workspace/components/AddWebChat";
import { useEdges, useNodeSelection, useZoomToFit } from "./workspace/hooks/Diagrams";

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

const ZoomTransition = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setCenter } = useReactFlow();

  const { handleSelectionChange, clearSelection } = useNodeSelection(nodes, setNodes);
  const { onConnect } = useEdges(setEdges);

  useZoomToFit(nodes, setCenter);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodeTypes = useMemo(
    () => ({
      integraciones: (props: any) => <IntegracionesNode {...props} openModal={() => setIsModalOpen(true)} />,
      agente: AgenteNode,
    }),
    []
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
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
      <AddWebchat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={function (domain: string): void {
        throw new Error(`Function not implemented. ${domain}`);
      }} />
    </>
  );
};


export default function Diagram() {
  return (
      <ZoomTransition />
  );
}
