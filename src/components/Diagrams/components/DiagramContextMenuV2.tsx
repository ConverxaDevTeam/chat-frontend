import React from "react";
import ContextMenu from "../../ContextMenu";
import { ContextMenuOption } from "../DiagramContextMenu";

interface DiagramContextMenuV2Props {
  options: ContextMenuOption[];
  x: number;
  y: number;
  onClose: () => void;
}

export const DiagramContextMenuV2: React.FC<DiagramContextMenuV2Props> = ({
  options,
  x,
  y,
  onClose,
}) => {
  return (
    <ContextMenu x={x} y={y} onClose={onClose}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={option.onClick}
          className="flex h-[50px] p-3 justify-center items-center rounded-lg hover:bg-sofia-electricOlive/10 transition-colors gap-[10px]"
        >
          {option.child} {option.tooltip}
        </button>
      ))}
    </ContextMenu>
  );
};
