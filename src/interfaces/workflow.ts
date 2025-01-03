import { Node, NodeProps } from "@xyflow/react";

export enum NodeStyle {
  NEUMORPHIC = "neumorphic",
  CENTRAL = "central",
}

// Tipado para los datos que se pasarán al nodo
export interface NodeData extends Record<string, unknown> {
  name: string;
  description: string;
  style?: NodeStyle;
}

export interface AgentData extends NodeData {
  agentId: number;
}

export interface CustomTypeNodeProps<T extends NodeData> extends NodeProps {
  data: T;
}

export interface CustomNodeProps<T extends Node> {
  data: T;
}
