import ContextMenu from "../ContextMenu";
import { useEffect, useRef, useState } from "react";

const dataOptions = [
  "Total Usuarios",
  "Nuevos Usuarios",
  "Usuarios recurrentes",
  "Sesiones, 30 minutos sin mensaje",
  "Mensajes por IA",
  "Mensajes por HITL",
  "Total de Mensajes",
  "Avg. Mensajes IA por Sesion",
  "Avg Mensajes HITL por Sesion",
  "Avg Sesiones por Usuario",
  "Mensajes por Canal",
  "Etiqueta por Sesion",
  "Cant. Llamadas a Funcion",
  "Funciones usadas por Sesion",
];

interface DataOptionsModalProps {
  position: { x: number; y: number };
  onClose: () => void;
}

const DataOptionsModal = ({ position, onClose }: DataOptionsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleOptionClick = () => {
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-lg p-2 z-50"
      style={{
        top: position.y,
        left: position.x,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="flex flex-col">
        {dataOptions.map((option, index) => (
          <button
            key={index}
            className="px-4 py-2 text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none hover:bg-sofia-secundario [font-feature-settings:'liga'_off,'clig'_off] whitespace-nowrap"
            onClick={handleOptionClick}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

interface OptionsSelectorProps {
  menuPosition: { x: number; y: number } | null;
  onMenuOpen: (e: React.MouseEvent) => void;
  onMenuClose: () => void;
}

export const OptionsSelector = ({
  menuPosition,
  onMenuOpen,
  onMenuClose,
}: OptionsSelectorProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dataModalPosition, setDataModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {},
        currentTarget: button,
        target: button,
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as unknown as React.MouseEvent;
      onMenuOpen(event);
    };

    button.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => {
      button.removeEventListener("touchstart", handleTouchStart);
    };
  }, [onMenuOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMenuOpen(e);
  };

  const handleDataOptionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setDataModalPosition({
      x: rect.right + 4,
      y: rect.top,
    });
  };

  const handleDataModalClose = () => {
    setDataModalPosition(null);
    onMenuClose();
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        className="p-1.5 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
      >
        <img src="mvp/three-dots.svg" className="w-[24px] h-[24px]" />
      </button>

      {menuPosition && (
        <ContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={onMenuClose}
        >
          <button
            className="text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none self-stretch [font-feature-settings:'liga'_off,'clig'_off]"
            onClick={handleDataOptionClick}
          >
            Datos a mostrar
          </button>
          <button className="text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none self-stretch [font-feature-settings:'liga'_off,'clig'_off]">
            Tipo de estadística
          </button>
        </ContextMenu>
      )}

      {dataModalPosition && (
        <DataOptionsModal
          position={dataModalPosition}
          onClose={handleDataModalClose}
        />
      )}
    </>
  );
};
