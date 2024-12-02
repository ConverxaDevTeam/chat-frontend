import { Node, NodeProps } from "@xyflow/react";

// Tipado para los datos que se pasarán al nodo
interface NodeData extends Record<string, unknown> {
  name: string;
  description: string;
}

interface AgentData extends NodeData {
  agentId: number;
}

export interface CustomTypeNodeProps extends NodeProps {
  data: NodeData; // Asegura que los datos tengan el tipo adecuado
}

export interface CustomNodeProps extends Node {
  data: NodeData;
}

export interface AgentNodeProps extends CustomTypeNodeProps {
  data: AgentData;
}
