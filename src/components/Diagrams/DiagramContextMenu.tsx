import { NeumorphicContainer } from "@components/NeumorphicContainer";
import React from "react";
import { createPortal } from "react-dom";

export interface ContextMenuOption {
  child: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}

interface DiagramContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: ContextMenuOption[];
}

const DiagramContextMenu: React.FC<DiagramContextMenuProps> = ({
  x,
  y,
  onClose,
  options,
}) => {
  return createPortal(
    <div className="absolute" style={{ left: x, top: y }}>
      <NeumorphicContainer width="auto" height="auto">
        <div className="flex flex-col m-[8px] gap-[8px]">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                onClose();
              }}
              className="p-2 text-left hover:bg-gray-200"
            >
              {option.child}
            </button>
          ))}
        </div>
      </NeumorphicContainer>
    </div>,
    document.body
  );
};

export default DiagramContextMenu;
