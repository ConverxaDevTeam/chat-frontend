import { useReactFlow } from "@xyflow/react";
import { NeumorphicContainer } from "../NeumorphicContainer";
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

  const buttonClass =
    "w-8 h-8 flex items-center justify-center hover:text-[#001126] rounded-md transition-colors duration-200 cursor-pointer item stroke-current stroke-[1]";

  const buttons = [
    { onClick: handleZoomIn, icon: "mvp/circle-plus.svg" },
    { onClick: handleZoomOut, icon: "mvp/circle-minus.svg" },
    { onClick: handleFitView, icon: "mvp/scan.svg" },
    { onClick: handleLock, icon: isLocked ? "mvp/lock.svg" : "mvp/unlock.svg" },
  ];

  return (
    <NeumorphicContainer className="absolute right-0 bottom-0">
      <div className="flex flex-col w-[37.33px] h-[144px] top-[855px] left-[1007.78px] gap-[16px]">
        {buttons.map(({ onClick, icon }, index) => (
          <button key={index} onClick={onClick} className={buttonClass}>
            <img src={icon} alt="icon" className="w-6 h-6" />
          </button>
        ))}
      </div>
    </NeumorphicContainer>
  );
};
