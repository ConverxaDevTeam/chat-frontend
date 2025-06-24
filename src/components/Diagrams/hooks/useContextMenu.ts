import { useState, useCallback, useEffect } from "react";
import { OnConnectEnd } from "@xyflow/react";
import { CustomTypeNodeProps, AgentData } from "@interfaces/workflow";

type ContextMenuState = {
  x: number;
  y: number;
  fromNode: CustomTypeNodeProps<AgentData>;
} | null;

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      // Si la conexión es válida o no es desde un nodo agente, no mostrar menú
      if (
        connectionState.isValid ||
        !connectionState.fromNode ||
        connectionState.fromNode.type !== "agente"
      ) {
        setContextMenu(null);
        return;
      }

      // Obtener coordenadas del evento
      const { clientX, clientY } =
        event instanceof MouseEvent ? event : event.touches[0];

      // Preparar datos del nodo origen
      const fromNodeProps = {
        id: connectionState.fromNode.id,
        type: connectionState.fromNode.type,
        data: connectionState.fromNode.data as { agentId: number },
      } as CustomTypeNodeProps<AgentData>;

      // Calcular posición óptima del menú
      const menuWidth = 200; // Ancho estimado del menú
      const menuHeight = 150; // Alto estimado del menú
      const padding = 10; // Espacio de padding

      // Obtener dimensiones de la ventana
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calcular posición ajustada
      let x = clientX;
      let y = clientY;

      // Ajustar horizontalmente
      if (x + menuWidth + padding > windowWidth) {
        x = x - menuWidth;
      }

      // Ajustar verticalmente
      if (y + menuHeight + padding > windowHeight) {
        y = y - menuHeight;
      }

      // Asegurar que el menú no se salga por la izquierda o arriba
      x = Math.max(padding, x);
      y = Math.max(padding, y);

      setContextMenu({
        x,
        y,
        fromNode: fromNodeProps,
      });
    },
    []
  );

  // Manejar clicks fuera del menú
  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Solo cerrar si el click no fue en el menú ni en un nodo
      if (
        !target.closest(".context-menu") &&
        !target.closest(".react-flow__node")
      ) {
        setContextMenu(null);
      }
    };

    // Manejar escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu]);

  return {
    contextMenu,
    setContextMenu,
    handleConnectEnd,
  };
};
