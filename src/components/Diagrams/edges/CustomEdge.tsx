import { EdgeProps, Position } from "@xyflow/react";

interface EdgePositionProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}

interface CurveParams {
  offset?: number; // Controla qué tanto se desvía la curva (default: 0.2)
  sourceSplit?: number; // Controla la posición del primer punto de control (default: 0.25)
  targetSplit?: number; // Controla la posición del segundo punto de control (default: 0.75)
}

function getControlPoints(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position,
  { offset = 1, sourceSplit = 0.35, targetSplit = 0.65 }: CurveParams = {}
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
    labelX: midX + normalX * length * sourceOffset * 0.5, // Promedio de los offsets
    labelY: midY + normalY * length * sourceOffset * 0.5,
  };
}

export function getEdgeParams({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  curveParams,
}: EdgePositionProps & { curveParams?: CurveParams }) {
  // Ajustamos los puntos de inicio/fin según la posición
  let startX = sourceX;
  let startY = sourceY;
  let endX = targetX;
  let endY = targetY;

  // Ajustamos según la posición del source
  switch (sourcePosition) {
    case Position.Left:
      startX -= 1;
      break;
    case Position.Right:
      startX += 1;
      break;
    case Position.Top:
      startY -= 1;
      break;
    case Position.Bottom:
      startY += 1;
      break;
  }

  // Ajustamos según la posición del target
  switch (targetPosition) {
    case Position.Left:
      endX -= 1;
      break;
    case Position.Right:
      endX += 1;
      break;
    case Position.Top:
      endY -= 1;
      break;
    case Position.Bottom:
      endY += 1;
      break;
  }

  const { control1X, control1Y, control2X, control2Y, labelX, labelY } =
    getControlPoints(
      startX,
      startY,
      endX,
      endY,
      sourcePosition,
      targetPosition,
      curveParams
    );

  // Creamos el path SVG usando una curva cúbica de Bezier
  const path = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;

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

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  curveParams,
  ...props
}: EdgeProps & { curveParams?: CurveParams }) {
  const { edgePath } = getEdgeParams({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curveParams,
  });

  return (
    <path
      d={edgePath}
      fill="none"
      className="react-flow__edge-path"
      markerEnd={markerEnd}
      style={{
        strokeWidth: 1,
        stroke: "#000000",
        strokeDasharray: "2,2",
        ...style,
      }}
      {...props}
    />
  );
}
