import { TimeRange, timeRangeLabels } from "./types";
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
          className="inline-flex w-[126px] items-center gap-2.5 px-2 py-1 text-sofia-superDark rounded-lg hover:bg-white/50 bg-sofia-secundario border border-sofia-superDark"
        >
          <span className="font-quicksand text-xs font-medium w-[88px] px-[2px] truncate flex items-center gap-2.5">
            {timeRangeLabels[timeRange]}
            <img
              src="/mvp/chevron-down.svg"
              alt="chevron"
              className="w-2.5 h-2.5"
            />
          </span>
        </button>
      ) : (
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          className="inline-flex w-6 h-6 p-[5px_2px] flex-col justify-center items-center gap-2.5 flex-shrink-0 rounded-full border border-sofia-superDark bg-sofia-secundario"
        >
          <img src="/mvp/calendar.svg" alt="calendar" className="w-3 h-3.5" />
        </button>
      )}

      {menuPosition && (
        <div
          className="absolute z-[100]"
          style={{ left: menuPosition.x, top: menuPosition.y }}
          onMouseDown={handleMouseDown}
        >
          <ContextMenu x={0} y={0} onClose={onMenuClose}>
            {Object.entries(timeRangeLabels).map(([value, label]) => (
              <button
                key={value}
                className="w-full text-left px-3 py-2 text-sm font-quicksand hover:bg-sofia-secundario text-sofia-superDark"
                onClick={() => handleOptionClick(value as TimeRange)}
                onMouseDown={handleMouseDown}
              >
                {label}
              </button>
            ))}
          </ContextMenu>
        </div>
      )}
    </>
  );
};
