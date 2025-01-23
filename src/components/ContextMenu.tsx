import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
  parentId?: string;
}

// Mantener registro de los menús abiertos
const openMenus: Set<string> = new Set();

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  children,
  parentId,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useRef(`menu-${Math.random()}`);

  useEffect(() => {
    // Registrar este menú como abierto
    openMenus.add(menuId.current);

    // Si hay un menú anterior abierto y no es el padre, cerrarlo
    if (!parentId) {
      openMenus.forEach(id => {
        if (id !== menuId.current && id !== parentId) {
          const event = new CustomEvent("closeMenu", { detail: { id } });
          document.dispatchEvent(event);
        }
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsideCurrentMenu = target.closest(
        `[data-menu-id="${menuId.current}"]`
      );
      const isInsideChildMenu = target.closest(".context-menu");

      // Cerrar solo si el click no fue dentro de este menú ni de un menú hijo
      if (!isInsideCurrentMenu && !isInsideChildMenu) {
        onClose();
        openMenus.delete(menuId.current);
      }
    };

    const handleCloseMenu = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail.id === menuId.current) {
        onClose();
        openMenus.delete(menuId.current);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("closeMenu", handleCloseMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("closeMenu", handleCloseMenu);
      openMenus.delete(menuId.current);
    };
  }, [onClose, parentId]);

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
      data-menu-id={menuId.current}
      className="context-menu absolute inline-flex flex-col items-start p-3.5 gap-2 rounded-lg border border-sofia-navyBlue bg-sofia-blancoPuro z-50"
      style={{ left: x, top: y }}
    >
      {React.Children.map(children, child => {
        // Verificar si es un divisor
        if (React.isValidElement(child) && child.props["data-divider"]) {
          return (
            <div className="h-[1px] bg-sofia-navyBlue/20 w-[50px] mx-auto" />
          );
        }

        return (
          <div className="flex justify-center items-center gap-2.5 self-stretch rounded hover:bg-sofia-electricOlive cursor-pointer">
            <div className="px-1 py-0.5">{child}</div>
          </div>
        );
      })}
    </div>,
    document.body
  );
};

export default ContextMenu;
