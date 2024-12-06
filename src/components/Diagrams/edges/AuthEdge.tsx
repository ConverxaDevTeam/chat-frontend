import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";
import { FaKey } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { AuthenticatorModal } from "../authComponents/AuthenticatorModal";

export function AuthEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [showModal, setShowModal] = useState(false);
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
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
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-white rounded-full shadow-md p-3 hover:bg-gray-50 transition-colors"
          >
            <FaKey className="text-blue-600 mr-1" size={20} />
          </button>
        </div>
      </EdgeLabelRenderer>

      {organizationId && (
        <AuthenticatorModal
          show={showModal}
          onClose={() => setShowModal(false)}
          organizationId={organizationId}
        />
      )}
    </>
  );
}
