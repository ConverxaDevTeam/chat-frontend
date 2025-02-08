import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
  parentId?: string;
}

// Registro de menús abiertos
const openMenus: Map<string, { id: string; parentId?: string }> = new Map();

// Hook para manejar el cierre de menús
const useMenuClosing = (
  menuId: string,
  parentId: string | undefined,
  onClose: () => void
) => {
  useEffect(() => {
    openMenus.set(menuId, { id: menuId, parentId });

    if (!parentId) {
      const menusToClose = Array.from(openMenus.values()).filter(menu => {
        return menu.id !== menuId && menu.id !== parentId;
      });

      menusToClose.forEach(menu => {
        const event = new CustomEvent("closeMenu", { detail: { id: menu.id } });
        document.dispatchEvent(event);
      });
    }

    return () => {
      openMenus.delete(menuId);
    };
  }, [menuId, parentId]);

  // Escuchar eventos de cierre
  useEffect(() => {
    const handleCloseEvent = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail.id === menuId) {
        onClose();
        openMenus.delete(menuId);
      }
    };

    document.addEventListener("closeMenu", handleCloseEvent);
    return () => {
      document.removeEventListener("closeMenu", handleCloseEvent);
    };
  }, [menuId, onClose]);
};

// Hook para manejar clicks fuera del menú
const useOutsideClick = (
  menuId: string,
  parentId: string | undefined,
  onClose: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.closest("button") ||
        target.closest('input[type="checkbox"]')
      ) {
        return;
      }

      const isInsideAnyMenu = target.closest(".context-menu");

      if (!isInsideAnyMenu) {
        const menusToClose = Array.from(openMenus.values());
        menusToClose.forEach(menu => {
          const event = new CustomEvent("closeMenu", {
            detail: { id: menu.id },
          });
          document.dispatchEvent(event);
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuId, onClose, parentId]);
};

// Hook para ajustar la posición del menú
const useMenuPosition = (
  menuRef: React.RefObject<HTMLDivElement>,
  x: number,
  y: number,
  parentId?: string
) => {
  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.75; // 3/4 de la pantalla

    let adjustedX = x;
    let adjustedY = y;

    if (parentId) {
      const parentMenu = document.querySelector(`[data-menu-id="${parentId}"]`);
      if (parentMenu) {
        const parentRect = parentMenu.getBoundingClientRect();
        adjustedX = parentRect.right;
        adjustedY =
          parentRect.top > threshold
            ? parentRect.top - rect.height
            : parentRect.top;
      }
    } else {
      adjustedY = y > threshold ? y - rect.height : y;
    }

    // Ajuste horizontal
    if (adjustedX + rect.width > windowWidth) {
      adjustedX = parentId
        ? adjustedX - rect.width - rect.width
        : windowWidth - rect.width;
    }

    // Asegurar que no se salga de la pantalla
    adjustedY = Math.max(0, Math.min(windowHeight - rect.height, adjustedY));

    menu.style.left = `${adjustedX}px`;
    menu.style.top = `${adjustedY}px`;
  }, [x, y, parentId]);
};

// Componente para el divisor
const MenuDivider = () => (
  <div className="h-[1px] bg-sofia-navyBlue/20 w-[50px] mx-auto" />
);

// Componente para envolver items del menú
const MenuItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center items-center gap-2.5 self-stretch rounded hover:bg-sofia-electricOlive cursor-pointer">
    <div className="px-1 py-0.5 w-full">{children}</div>
  </div>
);

// Función para manejar clicks en items
const handleMenuItemClick = (child: React.ReactNode, menuId: string) => {
  if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
    const originalOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        const childMenus = Array.from(openMenus.values()).filter(
          menu => menu.parentId === menuId
        );

        if (childMenus.length > 0) {
          childMenus.forEach(menu => {
            const event = new CustomEvent("closeMenu", {
              detail: { id: menu.id },
            });
            document.dispatchEvent(event);
          });
        }

        if (originalOnClick) originalOnClick(e);
      },
    });
  }
  return child;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  children,
  parentId,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useRef(`menu-${Math.random()}`);

  useMenuClosing(menuId.current, parentId, onClose);
  useOutsideClick(menuId.current, parentId, onClose);
  useMenuPosition(menuRef, x, y, parentId);

  return createPortal(
    <div
      ref={menuRef}
      data-menu-id={menuId.current}
      className="context-menu absolute inline-flex flex-col items-start p-[16px] gap-2 rounded-lg border border-sofia-navyBlue bg-sofia-blancoPuro z-50"
      style={{ left: x, top: y }}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.props["data-divider"]) {
          return <MenuDivider />;
        }

        return (
          <MenuItem>{handleMenuItemClick(child, menuId.current)}</MenuItem>
        );
      })}
    </div>,
    document.body
  );
};

export default ContextMenu;
