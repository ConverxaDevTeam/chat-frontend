import { TimeRange, timeRangeLabels } from "./types";
import { timeRangeOptions } from "../../services/analyticTypes";
import ContextMenu from "../ContextMenu";
import { useEffect, useRef } from "react";

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  isWide: boolean;
  onTimeRangeChange: (value: TimeRange) => void;
  menuPosition: { x: number; y: number } | null;
  onMenuOpen: (e: React.MouseEvent) => void;
  onMenuClose: () => void;
}

export const TimeRangeSelector = ({
  timeRange,
  isWide,
  onTimeRangeChange,
  menuPosition,
  onMenuOpen,
  onMenuClose,
}: TimeRangeSelectorProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleOptionClick = (value: TimeRange) => {
    onTimeRangeChange(value);
    onMenuClose();
  };

  return (
    <>
      {isWide ? (
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          className="inline-flex w-[126px] items-center justify-between px-2 py-1 text-sofia-superDark rounded-lg hover:bg-white/50 bg-sofia-secundario border border-sofia-superDark"
        >
            <span className="text-xs font-medium truncate">
              {timeRangeLabels[timeRange]}
            </span>
          <img
            src="/mvp/chevron-down.svg"
            alt="chevron"
            className="w-[14px] h-[14px]"
          />
        </button>
      ) : (
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          className="inline-flex w-6 h-6 p-[5px_2px] flex-col justify-center items-center gap-2.5 flex-shrink-0 rounded-full border border-sofia-superDark bg-sofia-secundario"
        >
          <img 
            src={`/mvp/${timeRangeOptions.find(opt => opt.id === timeRange)?.icon}`}
            alt="icon" 
            className="w-3 h-3.5" 
          />
        </button>
      )}

      {menuPosition && (
        <ContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={onMenuClose}
        >
          {timeRangeOptions.map((option) => (
            <button
              key={option.id}
              className="w-[128px] flex items-center gap-2 text-left text-[14px] font-medium text-sofia-superDark leading-none self-stretch [font-feature-settings:'liga'_off,'clig'_off]"
              onClick={() => handleOptionClick(option.id)}
              onMouseDown={handleMouseDown}
            >
              <img src={`/mvp/${option.icon}`} alt="icon" className="w-4 h-4" />
              <span>{option.label}</span>
            </button>
          ))}
        </ContextMenu>
      )}
    </>
  );
};
