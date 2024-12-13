import React from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  children,
}) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".context-menu")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div
      className="context-menu absolute bg-white shadow-lg rounded-lg p-2 min-w-[150px] z-50"
      style={{ left: x, top: y }}
    >
      {children}
    </div>,
    document.body
  );
};

export default ContextMenu;
