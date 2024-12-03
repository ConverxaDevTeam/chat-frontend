import { Node, NodeProps } from "@xyflow/react";

// Tipado para los datos que se pasarán al nodo
interface NodeData extends Record<string, unknown> {
  name: string;
  description: string;
}

export interface AgentData extends NodeData {
  agentId: number;
}

export interface FunctionData extends NodeData {
  functionId: number;
  type?: string;
  config?: Record<string, unknown>;
}

export interface CustomTypeNodeProps<T extends NodeData> extends NodeProps {
  data: T;
}

export interface CustomNodeProps<T extends Node> {
  data: T;
}
