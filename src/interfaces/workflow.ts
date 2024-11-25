import { NodeProps } from "@xyflow/react";

// Tipado para los datos que se pasarán al nodo
interface NodeData extends Record<string, unknown> {
  name: string;
  description: string;
  isSelected: boolean;
}

export interface CustomNodeProps extends NodeProps {
  data: NodeData; // Asegura que los datos tengan el tipo adecuado
}