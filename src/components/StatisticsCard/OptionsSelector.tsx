import ContextMenu from "../ContextMenu";
import { useEffect, useRef, useState } from "react";
import {
  displayTypeOptions,
  AnalyticType,
  StatisticsDisplayType,
  analyticOptions,
} from "../../services/analyticTypes";

interface Option {
  id: AnalyticType | StatisticsDisplayType;
  label: string;
}

const dataOptions = analyticOptions;
const statisticsTypes = displayTypeOptions;

interface DataOptionsModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  parentId?: string;
  onSelect?: (id: AnalyticType) => void;
  selectedAnalyticType?: AnalyticType;
}

interface StatisticsTypeModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  parentId?: string;
  onSelect?: (id: StatisticsDisplayType) => void;
  selectedDisplayType?: StatisticsDisplayType;
}

const DataOptionsModal = ({
  position,
  onClose,
  parentId,
  onSelect,
  selectedAnalyticType,
}: DataOptionsModalProps) => {
  const handleOptionClick = (id: AnalyticType) => {
    onSelect?.(id);
    onClose();
  };

  return (
    <ContextMenu
      x={position.x}
      y={position.y}
      onClose={onClose}
      parentId={parentId}
    >
      {dataOptions.map((option: Option) => (
        <button
          key={option.id}
          className={`text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none self-stretch [font-feature-settings:'liga'_off,'clig'_off] whitespace-nowrap ${
            selectedAnalyticType === option.id
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleOptionClick(option.id as AnalyticType)}
        >
          {option.label}
        </button>
      ))}
    </ContextMenu>
  );
};

const StatisticsTypeModal = ({
  position,
  onClose,
  parentId,
  onSelect,
  selectedDisplayType,
}: StatisticsTypeModalProps) => {
  const [showLegend, setShowLegend] = useState(false);

  const handleTypeClick = (id: StatisticsDisplayType) => {
    onSelect?.(id);
    onClose();
  };

  const handleLegendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLegend(!showLegend);
  };

  return (
    <ContextMenu
      x={position.x}
      y={position.y}
      onClose={onClose}
      parentId={parentId}
    >
      {statisticsTypes.map((option: Option) => (
        <button
          key={option.id}
          className={`text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none self-stretch [font-feature-settings:'liga'_off,'clig'_off] whitespace-nowrap ${
            selectedDisplayType === option.id
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTypeClick(option.id as StatisticsDisplayType)}
        >
          {option.label}
        </button>
      ))}
      <div data-divider />
      <button
        onClick={handleLegendClick}
        className="flex items-center gap-2 text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none [font-feature-settings:'liga'_off,'clig'_off] whitespace-nowrap"
      >
        <input
          type="checkbox"
          checked={showLegend}
          readOnly
          className="w-3 h-3 rounded border-sofia-navyBlue/30 text-sofia-electricOlive focus:ring-sofia-electricOlive"
        />
        Mostrar leyenda
      </button>
    </ContextMenu>
  );
};

interface OptionsSelectorProps {
  menuPosition: { x: number; y: number } | null;
  onMenuOpen: (e: React.MouseEvent) => void;
  onMenuClose: () => void;
  onDataOptionSelect: (type: AnalyticType) => void;
  onStatisticsTypeSelect: (type: StatisticsDisplayType) => void;
  onShowLegendChange: (show: boolean) => void;
  selectedAnalyticType: AnalyticType;
  selectedDisplayType: StatisticsDisplayType;
  showLegend: boolean;
  displayType: StatisticsDisplayType;
}

export const OptionsSelector = ({
  menuPosition,
  onMenuOpen,
  onMenuClose,
  onDataOptionSelect,
  onStatisticsTypeSelect,
  onShowLegendChange,
  selectedAnalyticType,
  selectedDisplayType,
  showLegend,
}: OptionsSelectorProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dataModalPosition, setDataModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [statisticsTypePosition, setStatisticsTypePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [menuId, setMenuId] = useState<string>();

  useEffect(() => {
    if (menuPosition) {
      setMenuId(`menu-${Math.random()}`);
    }
  }, [menuPosition]);

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
    e.stopPropagation();
    e.preventDefault();

    // Cerrar menú de estadísticas si está abierto
    setStatisticsTypePosition(null);

    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setDataModalPosition({
      x: rect.right + 4,
      y: rect.top,
    });
  };

  const handleStatisticsTypeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Cerrar menú de datos si está abierto
    setDataModalPosition(null);

    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setStatisticsTypePosition({
      x: rect.right + 4,
      y: rect.top,
    });
  };

  const handleDataModalClose = () => {
    setDataModalPosition(null);
    onMenuClose();
  };

  const handleStatisticsTypeClose = () => {
    setStatisticsTypePosition(null);
    onMenuClose();
  };

  const handleLegendClick = () => {
    onShowLegendChange(!showLegend);
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
          <button
            className="text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none self-stretch [font-feature-settings:'liga'_off,'clig'_off]"
            onClick={handleStatisticsTypeClick}
          >
            Tipo de estadística
          </button>
          <button
            onClick={handleLegendClick}
            className="flex items-center gap-2 text-left text-xs font-medium font-quicksand text-sofia-superDark leading-none [font-feature-settings:'liga'_off,'clig'_off] whitespace-nowrap"
          >
            <input
              type="checkbox"
              checked={showLegend}
              readOnly
              className="w-3 h-3 rounded border-sofia-navyBlue/30 text-sofia-electricOlive focus:ring-sofia-electricOlive"
            />
            Mostrar leyenda
          </button>
        </ContextMenu>
      )}

      {dataModalPosition && menuId && (
        <DataOptionsModal
          position={dataModalPosition}
          onClose={handleDataModalClose}
          parentId={menuId}
          onSelect={onDataOptionSelect}
          selectedAnalyticType={selectedAnalyticType}
        />
      )}

      {statisticsTypePosition && menuId && (
        <StatisticsTypeModal
          position={statisticsTypePosition}
          onClose={handleStatisticsTypeClose}
          parentId={menuId}
          onSelect={onStatisticsTypeSelect}
          selectedDisplayType={selectedDisplayType}
        />
      )}
    </>
  );
};
