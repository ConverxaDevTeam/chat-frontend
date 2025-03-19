import { EdgeProps, Position, Node } from "@xyflow/react";

interface CurveParams {
  offset?: number; // Controla qué tanto se desvía la curva (default: 0.2)
  sourceSplit?: number; // Controla la posición del primer punto de control (default: 0.25)
  targetSplit?: number; // Controla la posición del segundo punto de control (default: 0.75)
}

interface Point {
  x: number;
  y: number;
  id: string;
  node?: Node;
}

function getNodeIntersection(source: Point, target: Point): Point {
  // Obtenemos las dimensiones del nodo
  const nodeWidth = source.node?.width || 0;
  const nodeHeight = source.node?.height || 0;

  // Calculamos el centro del nodo
  const centerX = source.x;
  const centerY = source.y;

  // Vector desde el centro del nodo al target
  const dx = target.x - centerX;
  const dy = target.y - centerY;
  const angle = Math.atan2(dy, dx);

  // Calculamos la intersección usando el centro como punto de referencia
  const intersectX = centerX + (nodeWidth / 2) * Math.cos(angle);
  const intersectY = centerY + (nodeHeight / 2) * Math.sin(angle);

  return {
    x: intersectX,
    y: intersectY,
    id: source.id,
  };
}

function getEdgePosition(): Position {
  // Siempre retornamos el centro
  return Position.Top;
}

function getControlPoints(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position,
  { offset = 0.6, sourceSplit = 0.35, targetSplit = 0.65 }: CurveParams = {}
) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Ajustamos el offset según la posición
  let sourceOffset = offset;
  let targetOffset = -offset; // Invertimos el offset para el punto final

  // Reducimos el offset para conexiones horizontales o verticales
  if (
    (sourcePosition === Position.Left && targetPosition === Position.Right) ||
    (sourcePosition === Position.Right && targetPosition === Position.Left)
  ) {
    sourceOffset *= 0.5;
    targetOffset *= 0.5;
  } else if (
    (sourcePosition === Position.Top && targetPosition === Position.Bottom) ||
    (sourcePosition === Position.Bottom && targetPosition === Position.Top)
  ) {
    sourceOffset *= 0.7;
    targetOffset *= 0.7;
  }

  // Calculamos la dirección perpendicular (siempre hacia la izquierda)
  const normalX = -dy / length;
  const normalY = dx / length;

  // Calculamos los puntos de control
  const control1X =
    sourceX + dx * sourceSplit + normalX * length * sourceOffset;
  const control1Y =
    sourceY + dy * sourceSplit + normalY * length * sourceOffset;
  const control2X =
    sourceX + dx * targetSplit + normalX * length * targetOffset;
  const control2Y =
    sourceY + dy * targetSplit + normalY * length * targetOffset;

  // Punto medio para el label
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return {
    control1X,
    control1Y,
    control2X,
    control2Y,
    labelX: midX,
    labelY: midY,
  };
}

export function getEdgeParams(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position,
  curveParams?: CurveParams
) {
  const { control1X, control1Y, control2X, control2Y, labelX, labelY } =
    getControlPoints(
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      curveParams
    );

  // Creamos el path SVG usando una curva cúbica de Bezier
  const path = `M ${sourceX} ${sourceY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetX} ${targetY}`;

  return {
    edgePath: path,
    labelX,
    labelY,
    control1X,
    control1Y,
    control2X,
    control2Y,
  };
}

type CustomEdgeProps = EdgeProps & {
  curveParams?: CurveParams;
  sourceNode?: Node;
  targetNode?: Node;
  className?: string;
};

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceNode,
  targetNode,
  curveParams,
  style,
  markerEnd,
  source,
  target,
}: CustomEdgeProps) {
  const sourcePoint = {
    x: sourceX,
    y: sourceY,
    id: source,
    node: sourceNode,
  };
  const targetPoint = {
    x: targetX,
    y: targetY,
    id: target,
    node: targetNode,
  };

  const sourceIntersect = getNodeIntersection(sourcePoint, targetPoint);
  const targetIntersect = getNodeIntersection(targetPoint, sourcePoint);

  const sourcePos = getEdgePosition();
  const targetPos = getEdgePosition();

  const { edgePath } = getEdgeParams(
    sourceIntersect.x,
    sourceIntersect.y,
    targetIntersect.x,
    targetIntersect.y,
    sourcePos,
    targetPos,
    curveParams
  );

  // Solo pasamos las props seguras del DOM
  const pathProps = {
    d: edgePath,
    fill: "none",
    markerEnd,
    style: {
      strokeWidth: 1.5,
      strokeDasharray: "2.5 2",
      ...style,
    },
  };

  return (
    <svg className="stroke-sofia-superDark">
      <path {...pathProps} />
    </svg>
  );
}
