import React, { useRef, useEffect } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".context-menu")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Ajustar horizontalmente si se sale de la pantalla
    if (x + rect.width > windowWidth) {
      adjustedX = x - rect.width;
    }

    // Ajustar verticalmente si se sale de la pantalla
    if (y + rect.height > windowHeight) {
      adjustedY = y - rect.height;
    }

    menu.style.left = `${adjustedX}px`;
    menu.style.top = `${adjustedY}px`;
  }, [x, y]);

  return createPortal(
    <div
      ref={menuRef}
      className="context-menu absolute bg-white shadow-lg rounded-lg p-2 min-w-[150px] z-50"
      style={{ left: x, top: y }}
    >
      {children}
    </div>,
    document.body
  );
};

export default ContextMenu;
