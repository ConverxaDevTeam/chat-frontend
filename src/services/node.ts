import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@config/config";

interface NodePosition {
  x: number;
  y: number;
  type: string;
}

export const updateNodePosition = async (
  nodeId: number,
  position: NodePosition
) => {
  try {
    const response = await axiosInstance.patch(
      apiUrls.nodes.updateNodePosition(nodeId),
      { x: position.x, y: position.y, type: position.type }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating node position:", error);
    return null;
  }
};
