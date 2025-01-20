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
      className="context-menu absolute inline-flex flex-col items-start p-3.5 gap-2 rounded-lg border border-sofia-navyBlue bg-sofia-blancoPuro z-50"
      style={{ left: x, top: y }}
    >
      {React.Children.map(children, child => (
        <div className="flex justify-center items-center gap-2.5 self-stretch rounded hover:bg-sofia-electricOlive cursor-pointer">
          <div className="px-1 py-0.5">{child}</div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ContextMenu;
