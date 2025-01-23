import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
  parentId?: string;
}

// Mantener registro de los menús abiertos y sus relaciones padre-hijo
const openMenus: Map<string, { id: string; parentId?: string }> = new Map();

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
    // Registrar este menú y su relación padre-hijo
    openMenus.set(menuId.current, { id: menuId.current, parentId });

    // Si no es un menú hijo y hay otros menús abiertos que no son ancestros, cerrarlos
    if (!parentId) {
      const menusToClose = Array.from(openMenus.values()).filter(menu => {
        return menu.id !== menuId.current && menu.id !== parentId;
      });

      menusToClose.forEach(menu => {
        const event = new CustomEvent("closeMenu", { detail: { id: menu.id } });
        document.dispatchEvent(event);
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Si el click fue en un botón o checkbox dentro de cualquier menú, no hacer nada
      if (
        target.closest("button") ||
        target.closest('input[type="checkbox"]')
      ) {
        return;
      }

      const isInsideAnyMenu = target.closest(".context-menu");

      // Si el click fue fuera de cualquier menú, cerrar todos
      if (!isInsideAnyMenu) {
        Array.from(openMenus.values()).forEach(menu => {
          const event = new CustomEvent("closeMenu", {
            detail: { id: menu.id },
          });
          document.dispatchEvent(event);
        });
        return;
      }

      // Si el click fue dentro del menú actual, no hacer nada
      const isInsideCurrentMenu = target.closest(
        `[data-menu-id="${menuId.current}"]`
      );
      if (isInsideCurrentMenu) return;

      // Si el click fue en otro menú, cerrar este
      onClose();
      openMenus.delete(menuId.current);
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

  // Función para cerrar menús hijos cuando se hace click en un botón del menú
  const handleMenuItemClick = (child: React.ReactNode) => {
    if (React.isValidElement(child)) {
      const originalOnClick = child.props.onClick;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          // Cerrar cualquier menú hijo abierto
          const childMenus = Array.from(openMenus.values()).filter(
            menu => menu.parentId === menuId.current
          );

          if (childMenus.length > 0) {
            childMenus.forEach(menu => {
              const event = new CustomEvent("closeMenu", {
                detail: { id: menu.id },
              });
              document.dispatchEvent(event);
            });
          }

          // Ejecutar el onClick original después de cerrar los menús hijos
          if (originalOnClick) originalOnClick(e);
        },
      });
    }
    return child;
  };

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
            <div className="px-1 py-0.5 w-full">
              {handleMenuItemClick(child)}
            </div>
          </div>
        );
      })}
    </div>,
    document.body
  );
};

export default ContextMenu;
