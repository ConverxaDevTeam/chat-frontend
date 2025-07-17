import React from "react";
import ContextMenu from "../../ContextMenu";
import { ContextMenuOption } from "../DiagramContextMenu";

interface DiagramContextMenuV2Props {
  options: ContextMenuOption[];
  position: { x: number; y: number };
  onClose: () => void;
}

export const DiagramContextMenuV2: React.FC<DiagramContextMenuV2Props> = ({
  options,
  position,
  onClose,
}) => {
  return (
    <ContextMenu position={position} onClose={onClose}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.onClick();
            onClose();
          }}
          className="flex w-full items-center rounded-lg hover:bg-app-electricOlive/10 transition-colors gap-[10px] whitespace-nowrap"
        >
          {option.child}{" "}
          <span className="text-[#001126] text-[14px] font-[500] leading-normal">
            {option.tooltip}
          </span>
        </button>
      ))}
    </ContextMenu>
  );
};
