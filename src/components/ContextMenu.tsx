import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
  parentId?: string;
  bodyClassname?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
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
    const handleClickOutside = () => {
      const menusToClose = Array.from(openMenus.values());
      menusToClose.forEach(menu => {
        const event = new CustomEvent("closeMenu", {
          detail: { id: menu.id },
        });
        document.dispatchEvent(event);
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuId, onClose, parentId]);
};

// Función pura para calcular posición de menú
const calculateMenuPosition = (
  targetPosition: { x: number; y: number },
  menuSize: { width: number; height: number },
  parentRect: DOMRect | null,
  viewport: { width: number; height: number }
) => {
  const PADDING = 8;
  const THRESHOLD = viewport.height * 0.75;

  let position = { x: targetPosition.x, y: targetPosition.y };

  if (parentRect) {
    // PASO 1: Determinar mejor posición HORIZONTAL
    const horizontalOptions = [
      { x: parentRect.right, name: "right" }, // Derecha del parent
      { x: parentRect.left - menuSize.width, name: "left" }, // Izquierda del parent
      { x: parentRect.left, name: "center" }, // Centrado
    ];

    let bestHorizontalX = targetPosition.x;
    for (const option of horizontalOptions) {
      const fitsHorizontally =
        option.x >= PADDING &&
        option.x + menuSize.width <= viewport.width - PADDING;

      if (fitsHorizontally) {
        bestHorizontalX = option.x;

        break;
      }
    }

    // PASO 2: Determinar mejor posición VERTICAL
    const verticalOptions = [
      { y: parentRect.top, name: "same-level" }, // Mismo nivel del parent
      { y: parentRect.top - menuSize.height, name: "above" }, // Arriba del parent
      { y: parentRect.bottom, name: "below" }, // Abajo del parent
    ];

    let bestVerticalY = targetPosition.y;
    for (const option of verticalOptions) {
      const fitsVertically =
        option.y >= PADDING &&
        option.y + menuSize.height <= viewport.height - PADDING;

      if (fitsVertically) {
        bestVerticalY = option.y;

        break;
      }
    }

    position = { x: bestHorizontalX, y: bestVerticalY };
  } else {
    // Menú principal - usar threshold para Y
    if (position.y > THRESHOLD) {
      position.y = position.y - menuSize.height;
    }
  }

  // Constrain final position to viewport (solo si realmente no cabe)
  position.x = Math.max(
    PADDING,
    Math.min(position.x, viewport.width - menuSize.width - PADDING)
  );
  position.y = Math.max(
    PADDING,
    Math.min(position.y, viewport.height - menuSize.height - PADDING)
  );

  return position;
};

// Hook para ajustar la posición del menú
const useMenuPosition = (
  menuRef: React.RefObject<HTMLDivElement>,
  position: { x: number; y: number },
  parentId?: string
) => {
  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Primero, remover restricciones para obtener el tamaño natural
    menu.style.maxWidth = "";
    menu.style.maxHeight = "";
    menu.style.overflowX = "";
    menu.style.overflowY = "";

    // Forzar reflow para obtener dimensiones naturales
    menu.offsetHeight;

    const naturalRect = menu.getBoundingClientRect();

    // Solo aplicar limitaciones si el contenido natural es demasiado grande
    const maxWidth = viewport.width * 0.8;
    const maxHeight = viewport.height * 0.8;

    if (naturalRect.width > maxWidth) {
      menu.style.maxWidth = `${maxWidth}px`;
      menu.style.overflowX = "auto";
    }

    if (naturalRect.height > maxHeight) {
      menu.style.maxHeight = `${maxHeight}px`;
      menu.style.overflowY = "auto";
    }

    // Forzar reflow después de aplicar restricciones si es necesario
    menu.offsetHeight;

    const menuRect = menu.getBoundingClientRect();

    let parentRect: DOMRect | null = null;
    if (parentId) {
      const allMenus = document.querySelectorAll("[data-menu-id]");

      // ESTRATEGIA ALTERNATIVA: Si hay parentId pero no encontramos el elemento,
      // usar el primer menú que no sea este (el más reciente antes de este)
      let parentElement = document.querySelector(
        `[data-menu-id="${parentId}"]`
      );

      if (!parentElement && allMenus.length > 1) {
        // Tomar el menú anterior (debería ser el parent)
        parentElement = allMenus[allMenus.length - 2] as HTMLElement;
      }

      parentRect = parentElement?.getBoundingClientRect() || null;
    }

    const finalPosition = calculateMenuPosition(
      position,
      { width: menuRect.width, height: menuRect.height },
      parentRect,
      viewport
    );

    menu.style.left = `${finalPosition.x}px`;
    menu.style.top = `${finalPosition.y}px`;
  }, [position.x, position.y, parentId]);
};

// Componente para el divisor
export const MenuDivider = () => (
  <div className="h-[1px] bg-app-celeste/20 w-[50px] mx-auto" />
);

// Componente para envolver items del menú
export const MenuItem: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="flex items-start gap-[10px] hover:bg-[#DBEAF2] cursor-pointer px-2 py-1 rounded w-full"
    onClick={e => e.stopPropagation()}
    onMouseDown={e => e.stopPropagation()}
  >
    {children}
  </div>
);

// Función para manejar clicks en items
const handleMenuItemClick = (child: React.ReactNode, menuId: string) => {
  if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
    const originalOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

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
      onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (child.props.onMouseDown) child.props.onMouseDown(e);
      },
    });
  }
  return child;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  children,
  parentId,
  header,
  footer,
  bodyClassname,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useRef(
    `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  useMenuClosing(menuId, parentId, onClose);
  useOutsideClick(menuId, parentId, onClose);
  useMenuPosition(menuRef, position, parentId);

  // Prevenir que los eventos se propaguen fuera del menú
  const preventPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return createPortal(
    <div
      ref={menuRef}
      data-menu-id={menuId}
      className="fixed flex flex-col p-[12px] gap-[10px] items-start rounded-lg border-2 border-app-darkBlue bg-app-blancoPuro whitespace-nowrap"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 998,
      }}
      onClick={preventPropagation}
      onMouseDown={preventPropagation}
      onTouchStart={preventPropagation}
      onTouchMove={preventPropagation}
      onTouchEnd={preventPropagation}
      data-menu-parent-id={parentId || ""}
    >
      {header && (
        <div
          className="w-full mb-2"
          onClick={preventPropagation}
          onMouseDown={preventPropagation}
        >
          {header}
        </div>
      )}
      <div
        className={bodyClassname}
        onClick={preventPropagation}
        onMouseDown={preventPropagation}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.props["data-divider"]) {
            return <MenuDivider />;
          }

          return <MenuItem>{handleMenuItemClick(child, menuId)}</MenuItem>;
        })}
      </div>
      {footer && (
        <div
          className="w-full mt-2"
          onClick={preventPropagation}
          onMouseDown={preventPropagation}
        >
          {footer}
        </div>
      )}
    </div>,
    document.body
  );
};

export default ContextMenu;
