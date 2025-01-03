import { useReactFlow } from "@xyflow/react";
import { NeumorphicContainer } from "../NeumorphicContainer";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { useState, MouseEvent, useCallback } from "react";

export const CustomControls = () => {
  const reactFlowInstance = useReactFlow();
  const { zoomIn, zoomOut, fitView } = reactFlowInstance;
  const [isLocked, setIsLocked] = useState(false);

  const handleZoomIn = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("Zoom in");
    e.preventDefault();
    zoomIn();
  };

  const handleZoomOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Zoom out");
    zoomOut();
  };

  const handleFitView = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Fit view");
    fitView();
  };

  const handleLock = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsLocked(prev => {
        const newState = !prev;
        reactFlowInstance.getNodes().forEach(() => {
          reactFlowInstance.setNodes(nodes =>
            nodes.map(n => ({
              ...n,
              draggable: !newState,
              connectable: !newState,
            }))
          );
        });
        return newState;
      });
    },
    [reactFlowInstance]
  );

  return (
    <NeumorphicContainer className="right-4 bottom-4 flex flex-col gap-2 p-2 z-50">
      <button
        onClick={handleZoomIn}
        className="w-8 h-8 flex items-center justify-center hover:text-gray-600 rounded-md transition-colors duration-200 cursor-pointer"
      >
        <AiOutlinePlus className="w-5 h-5" />
      </button>

      <button
        onClick={handleZoomOut}
        className="w-8 h-8 flex items-center justify-center hover:text-gray-600 rounded-md transition-colors duration-200 cursor-pointer"
      >
        <AiOutlineMinus className="w-5 h-5" />
      </button>

      <button
        onClick={handleFitView}
        className="w-8 h-8 flex items-center justify-center hover:text-gray-600 rounded-md transition-colors duration-200 cursor-pointer"
      >
        <BiReset className="w-5 h-5" />
      </button>

      <button
        onClick={handleLock}
        className="w-8 h-8 flex items-center justify-center hover:text-gray-600 rounded-md transition-colors duration-200 cursor-pointer"
      >
        {isLocked ? (
          <MdOutlineLock className="w-5 h-5" />
        ) : (
          <MdOutlineLockOpen className="w-5 h-5" />
        )}
      </button>
    </NeumorphicContainer>
  );
};
