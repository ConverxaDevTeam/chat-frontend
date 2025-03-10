import { useReactFlow } from "@xyflow/react";
import { NeumorphicContainer } from "../NeumorphicContainer";
import { useState, MouseEvent, useCallback } from "react";

export const CustomControls = () => {
  const reactFlowInstance = useReactFlow();
  const { zoomIn, zoomOut, fitView } = reactFlowInstance;
  const [isLocked, setIsLocked] = useState(false);

  const handleZoomIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    zoomIn();
  };

  const handleZoomOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    zoomOut();
  };

  const handleFitView = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
    { onClick: handleZoomIn, icon: "mvp/circle-plus.svg", tooltip: "Zoom in" },
    { onClick: handleZoomOut, icon: "mvp/circle-minus.svg", tooltip: "Zoom out" },
    { onClick: handleFitView, icon: "mvp/scan.svg", tooltip: "Fit view" },
    { onClick: handleLock, icon: isLocked ? "mvp/lock.svg" : "mvp/unlock.svg", tooltip: isLocked ? "Unlock" : "Lock" },
  ];

  return (
    <NeumorphicContainer className="absolute right-0 bottom-0">
      <div className="flex flex-col w-[37.33px] h-[144px] top-[855px] left-[1007.78px] gap-[5px]">
        {buttons.map(({ onClick, icon, tooltip }, index) => (
          <div key={index} className="relative group">
            <button onClick={onClick} className={buttonClass}>
              <img src={icon} alt="icon" className="w-6 h-6" />
            </button>
            <div className="absolute top-1/2 right-full flex items-center justify-center bg-gray-800 font-normal text-white rounded-md px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-xs whitespace-nowrap z-50">
              {tooltip}
            </div>
          </div>
        ))}
      </div>
    </NeumorphicContainer>
  );
};
