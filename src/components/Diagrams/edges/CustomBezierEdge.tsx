import {
  EdgeProps,
  Position,
  EdgeLabelRenderer,
  useReactFlow,
} from "@xyflow/react";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { AuthenticatorModal } from "../authComponents/AuthenticatorModal";

interface BezierEdgeProps extends EdgeProps {
  curvature?: number;
  data?: {
    functionId?: number;
    authenticatorId?: number;
  };
}

function getBezierPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  curvature = 0.5,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  curvature?: number;
}): [path: string, labelX: number, labelY: number] {
  let cX1 = sourceX;
  let cY1 = sourceY;

  switch (sourcePosition) {
    case Position.Left:
      cX1 = sourceX - Math.abs(targetX - sourceX) * curvature;
      cY1 = sourceY;
      break;
    case Position.Right:
      cX1 = sourceX + Math.abs(targetX - sourceX) * curvature;
      cY1 = sourceY;
      break;
    case Position.Top:
      cX1 = sourceX;
      cY1 = sourceY - Math.abs(targetY - sourceY) * curvature;
      break;
    case Position.Bottom:
      cX1 = sourceX;
      cY1 = sourceY + Math.abs(targetY - sourceY) * curvature;
      break;
  }

  let cX2 = targetX;
  let cY2 = targetY;

  switch (targetPosition) {
    case Position.Left:
      cX2 = targetX - Math.abs(targetX - sourceX) * curvature;
      cY2 = targetY;
      break;
    case Position.Right:
      cX2 = targetX + Math.abs(targetX - sourceX) * curvature;
      cY2 = targetY;
      break;
    case Position.Top:
      cX2 = targetX;
      cY2 = targetY - Math.abs(targetY - sourceY) * curvature;
      break;
    case Position.Bottom:
      cX2 = targetX;
      cY2 = targetY + Math.abs(targetY - sourceY) * curvature;
      break;
  }

  const path = `M${sourceX},${sourceY} C${cX1},${cY1} ${cX2},${cY2} ${targetX},${targetY}`;

  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return [path, labelX, labelY];
}

export default function CustomBezierEdge({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  curvature = 0.5,
  style,
  id,
  data,
}: BezierEdgeProps) {
  const [showModal, setShowModal] = useState(false);
  const { setEdges } = useReactFlow();
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
  );

  const handleAuthenticatorUpdate = useCallback(
    (authenticatorId: number | undefined) => {
      setEdges(edges =>
        edges.map(edge => {
          if (edge.id === id) {
            return {
              ...edge,
              data: {
                ...edge.data,
                authenticatorId,
              },
            };
          }
          return edge;
        })
      );
    },
    [id, setEdges]
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature,
  });

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 1.5,
          strokeDasharray: "2.5 2",
          stroke: "#001130",
          fill: "none",
          ...style,
        }}
      />
      {data?.functionId && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center rounded-full shadow-md p-3 transition-colors ${
                data?.authenticatorId
                  ? "bg-app-secundario hover:bg-blue-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {data?.authenticatorId ? (
                <img src="/mvp/lock.svg" alt="Autenticador" />
              ) : (
                <img src="/mvp/unlock.svg" alt="Autenticador" />
              )}
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
      {organizationId && data?.functionId && (
        <AuthenticatorModal
          show={showModal}
          onClose={() => setShowModal(false)}
          organizationId={organizationId}
          functionId={data.functionId}
          selectedAuthenticatorId={data.authenticatorId}
          handleAuthenticatorUpdate={handleAuthenticatorUpdate}
        />
      )}
    </>
  );
}
