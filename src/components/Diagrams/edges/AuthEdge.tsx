import { useState, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { FaKey } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { AuthenticatorModal } from "../authComponents/AuthenticatorModal";

interface AuthEdgeData {
  functionId: number;
  authenticatorId?: number;
  onAuthenticatorChange?: (functionId: number, authenticatorId: number) => void;
}

interface AuthEdgeProps extends Omit<EdgeProps, "data"> {
  data: AuthEdgeData;
}

export function AuthEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: AuthEdgeProps) {
  console.log(data);
  const [showModal, setShowModal] = useState(false);
  const { setEdges } = useReactFlow();
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
  );

  const handleAuthenticatorUpdate = useCallback(
    (authenticatorId: number | undefined) => {
      setEdges(edges =>
        edges.map(edge => {
          if (edge.source === data.functionId.toString()) {
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
    [data.functionId, setEdges]
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
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
                ? "bg-blue-50 hover:bg-blue-100"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <FaKey
              className={`${data?.authenticatorId ? "text-blue-600" : "text-gray-400"} mr-1`}
              size={20}
            />
          </button>
        </div>
      </EdgeLabelRenderer>
      {organizationId && data?.functionId && (
        <AuthenticatorModal
          show={showModal}
          onClose={() => setShowModal(false)}
          organizationId={organizationId}
          functionId={data.functionId}
          selectedAuthenticatorId={data.authenticatorId}
          handleAuthenticatorUpdate={handleAuthenticatorUpdate}
          onAuthenticatorChange={data.onAuthenticatorChange}
        />
      )}
    </>
  );
}
