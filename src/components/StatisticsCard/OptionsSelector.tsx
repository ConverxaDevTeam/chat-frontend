import ContextMenu from "../ContextMenu";
import { useEffect, useRef, useState } from "react";
import {
  displayTypeOptions,
  AnalyticType,
  StatisticsDisplayType,
  analyticOptions,
  AnalyticDescription,
} from "../../services/analyticTypes";
import InfoTooltip from "@components/common/InfoTooltip";

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
  onSelect?: (types: AnalyticType[]) => void;
  selectedAnalyticTypes?: AnalyticType[];
}

const DataOptionsModal = ({
  position,
  onClose,
  parentId,
  onSelect,
  selectedAnalyticTypes = [],
}: DataOptionsModalProps) => {
  const [selectedTypes, setSelectedTypes] = useState<AnalyticType[]>(
    selectedAnalyticTypes
  );

  const handleOptionClick = (id: AnalyticType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const newTypes = selectedTypes.includes(id)
      ? selectedTypes.filter(t => t !== id)
      : [...selectedTypes, id];

    setSelectedTypes(newTypes);
    onSelect?.(newTypes);
  };

  return (
    <ContextMenu position={position} onClose={onClose} parentId={parentId}>
      {dataOptions.map(option => (
        <button
          key={option.id}
          className={`flex w-full items-center gap-2 px-2 py-1 text-[14px] text-sofia-superDark rounded-md ${
            selectedTypes.includes(option.id) ? "bg-sofia-darkBlue" : ""
          }`}
          onClick={e => handleOptionClick(option.id, e)}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            {option.label}
            <InfoTooltip
              text={AnalyticDescription[option.id]}
              width={"220px"}
            />
          </div>
        </button>
      ))}
    </ContextMenu>
  );
};

interface StatisticsTypeModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  parentId?: string;
  onSelect?: (id: StatisticsDisplayType) => void;
  selectedDisplayType?: StatisticsDisplayType;
}

const StatisticsTypeModal = ({
  position,
  onClose,
  parentId,
  onSelect,
  selectedDisplayType,
}: StatisticsTypeModalProps) => {
  const handleTypeClick = (id: StatisticsDisplayType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    onSelect?.(id);
    onClose();
  };

  return (
    <ContextMenu
      position={position}
      onClose={onClose}
      parentId={parentId}
      bodyClassname="w-full"
    >
      {statisticsTypes.map((option: Option) => (
        <button
          key={option.id}
          className={`flex w-full items-center gap-2 px-2 py-[2px] text-[14px] text-sofia-superDark rounded-md hover:bg-sofia-lightBlue/10 transition-colors ${
            selectedDisplayType === option.id ? "bg-sofia-darkBlue" : ""
          }`}
          onClick={e => handleTypeClick(option.id as StatisticsDisplayType, e)}
          onMouseDown={e => e.stopPropagation()}
        >
          {option.label}
        </button>
      ))}
    </ContextMenu>
  );
};

interface OptionsButtonProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  onClick: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isOpen?: boolean;
}

const OptionsButton = ({
  buttonRef,
  onClick,
  onMouseDown,
  isOpen,
}: OptionsButtonProps) => (
  <button
    ref={buttonRef}
    onClick={onClick}
    onMouseDown={onMouseDown}
    className={`p-1.5 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors ${
      isOpen ? "bg-sofia-darkBlue" : ""
    }`}
  >
    <img src="mvp/three-dots.svg" className="w-[24px] h-[24px]" />
  </button>
);

interface MenuButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  iconUrl?: string;
}

const MenuButton = ({ onClick, children, iconUrl }: MenuButtonProps) => (
  <button
    className="flex items-center gap-2 w-full text-[14px] text-sofia-superDark hover:bg-sofia-lightBlue/10 transition-colors"
    onClick={onClick}
    onMouseDown={e => e.stopPropagation()}
  >
    {iconUrl && (
      <img src={iconUrl} alt="Icon" className="w-4 h-4 flex-shrink-0" />
    )}
    <span className="flex-grow text-left">{children}</span>
  </button>
);

interface LegendToggleProps {
  showLegend: boolean;
  onChange: (e: React.MouseEvent) => void;
}

const LegendToggle = ({ showLegend, onChange }: LegendToggleProps) => (
  <button
    onClick={onChange}
    onMouseDown={e => e.stopPropagation()}
    className="flex items-center gap-2 w-full text-[14px] text-sofia-superDark hover:bg-sofia-lightBlue/10 transition-colors"
  >
    <input
      type="checkbox"
      checked={showLegend}
      readOnly
      className="w-4 h-4 rounded border-sofia-navyBlue/30 text-sofia-darkBlue focus:ring-sofia-darkBlue flex-shrink-0"
      onClick={e => e.stopPropagation()}
    />
    <span className="flex-grow text-left">Mostrar leyenda</span>
  </button>
);

interface OptionsMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDataOptionClick: (e: React.MouseEvent) => void;
  onStatisticsTypeClick: (e: React.MouseEvent) => void;
  showLegend: boolean;
  onShowLegendChange: (value: boolean) => void;
  onDeleteCard?: (e: React.MouseEvent) => void;
}

const OptionsMenu = ({
  x,
  y,
  onClose,
  onDataOptionClick,
  onStatisticsTypeClick,
  showLegend,
  onShowLegendChange,
  onDeleteCard,
}: OptionsMenuProps) => (
  <ContextMenu position={{ x, y }} onClose={onClose} bodyClassname="w-full">
    <MenuButton onClick={onDataOptionClick} iconUrl="mvp/list.svg">
      Datos a mostrar
    </MenuButton>
    <MenuButton onClick={onStatisticsTypeClick} iconUrl="mvp/estadistica.svg">
      Tipo de estadística
    </MenuButton>
    <div data-divider />
    <LegendToggle
      showLegend={showLegend}
      onChange={e => {
        e.stopPropagation();
        e.preventDefault();
        onShowLegendChange(!showLegend);
        onClose();
      }}
    />
    <div data-divider />
    <MenuButton
      onClick={onDeleteCard ? onDeleteCard : e => e.preventDefault()}
      iconUrl="mvp/trash.svg"
    >
      Eliminar Tarjeta
    </MenuButton>
  </ContextMenu>
);

interface DataModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  parentId: string;
  onSelect: (types: AnalyticType[]) => void;
  selectedAnalyticTypes: AnalyticType[];
}

const DataModal = ({
  position,
  onClose,
  parentId,
  onSelect,
  selectedAnalyticTypes,
}: DataModalProps) => (
  <DataOptionsModal
    position={position}
    onClose={onClose}
    parentId={parentId}
    onSelect={onSelect}
    selectedAnalyticTypes={selectedAnalyticTypes}
  />
);

interface StatisticsModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  parentId: string;
  onSelect: (type: StatisticsDisplayType) => void;
  selectedDisplayType: StatisticsDisplayType;
}

const StatisticsModal = ({
  position,
  onClose,
  parentId,
  onSelect,
  selectedDisplayType,
}: StatisticsModalProps) => (
  <StatisticsTypeModal
    position={position}
    onClose={onClose}
    parentId={parentId}
    onSelect={onSelect}
    selectedDisplayType={selectedDisplayType}
  />
);

interface OptionsSelectorProps {
  menuPosition: { x: number; y: number } | null;
  onMenuOpen: (e: React.MouseEvent) => void;
  onMenuClose: () => void;
  onDataOptionSelect: (types: AnalyticType[]) => void;
  onStatisticsTypeSelect: (type: StatisticsDisplayType) => void;
  onShowLegendChange: (show: boolean) => void;
  selectedAnalyticTypes: AnalyticType[];
  selectedDisplayType: StatisticsDisplayType;
  showLegend: boolean;
  cardId?: number;
  onDeleteCard?: (cardId: number) => void;
}

const useMenuId = (menuPosition: { x: number; y: number } | null) => {
  const [menuId, setMenuId] = useState<string>();

  useEffect(() => {
    if (menuPosition) {
      setMenuId(`menu-${Math.random()}`);
    }
  }, [menuPosition]);

  return menuId;
};

const useTouchEvents = (
  buttonRef: React.RefObject<HTMLButtonElement>,
  onMenuOpen: (e: React.MouseEvent) => void
) => {
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
  }, [onMenuOpen, buttonRef]);
};

const useModalPosition = () => {
  const [dataModalPosition, setDataModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [statisticsTypePosition, setStatisticsTypePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return {
    dataModalPosition,
    statisticsTypePosition,
    setDataModalPosition,
    setStatisticsTypePosition,
  };
};

const useModalHandlers = (
  setDataModalPosition: (position: { x: number; y: number } | null) => void,
  setStatisticsTypePosition: (
    position: { x: number; y: number } | null
  ) => void,
  onMenuOpen: (e: React.MouseEvent) => void,
  onMenuClose: () => void
) => {
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

  return {
    handleMouseDown,
    handleClick,
    handleDataOptionClick,
    handleStatisticsTypeClick,
    handleDataModalClose,
    handleStatisticsTypeClose,
  };
};

export const OptionsSelector = ({
  menuPosition,
  onMenuOpen,
  onMenuClose,
  onDataOptionSelect,
  onStatisticsTypeSelect,
  onShowLegendChange,
  selectedAnalyticTypes,
  selectedDisplayType,
  showLegend,
  cardId,
  onDeleteCard,
}: OptionsSelectorProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useMenuId(menuPosition);
  const {
    dataModalPosition,
    statisticsTypePosition,
    setDataModalPosition,
    setStatisticsTypePosition,
  } = useModalPosition();
  const {
    handleMouseDown,
    handleClick,
    handleDataOptionClick,
    handleStatisticsTypeClick,
    handleDataModalClose,
    handleStatisticsTypeClose,
  } = useModalHandlers(
    setDataModalPosition,
    setStatisticsTypePosition,
    onMenuOpen,
    onMenuClose
  );

  const handleOptionsButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (menuPosition) {
      onMenuClose();
    } else {
      handleClick(e);
    }
  };

  useTouchEvents(buttonRef, handleClick);

  return (
    <>
      <OptionsButton
        buttonRef={buttonRef}
        onClick={handleOptionsButtonClick}
        onMouseDown={handleMouseDown}
        isOpen={!!menuPosition}
      />

      {menuPosition && (
        <OptionsMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={onMenuClose}
          onDataOptionClick={handleDataOptionClick}
          onStatisticsTypeClick={handleStatisticsTypeClick}
          showLegend={showLegend}
          onShowLegendChange={onShowLegendChange}
          onDeleteCard={
            cardId && onDeleteCard
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                  onDeleteCard(cardId);
                  onMenuClose();
                }
              : undefined
          }
        />
      )}

      {dataModalPosition && menuId && (
        <DataModal
          position={dataModalPosition}
          onClose={handleDataModalClose}
          parentId={menuId}
          onSelect={onDataOptionSelect}
          selectedAnalyticTypes={selectedAnalyticTypes}
        />
      )}

      {statisticsTypePosition && menuId && (
        <StatisticsModal
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
