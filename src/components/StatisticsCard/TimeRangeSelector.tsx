import { TimeRange, timeRangeLabels } from "./types";
import ContextMenu from "../ContextMenu";

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
  return (
    <>
      {isWide ? (
        <button
          onClick={onMenuOpen}
          className="inline-flex w-[126px] items-center gap-2.5 px-2 py-1 text-[#001126] rounded-lg hover:bg-white/50 bg-[#D0FBF8] border border-[#001126]"
        >
          <span className="font-quicksand text-xs font-medium w-[88px] px-[2px] truncate flex items-center gap-2.5">
            {timeRangeLabels[timeRange]}
          </span>
          <img
            src="/mvp/chevron-down.svg"
            alt="expand"
            className="w-3.5 h-3.5 flex-shrink-0"
          />
        </button>
      ) : (
        <button
          onClick={onMenuOpen}
          className="inline-flex w-6 h-6 p-[5px_2px] flex-col justify-center items-center gap-2.5 flex-shrink-0 rounded-3xl border border-[#001126] bg-[#D0FBF8]"
        >
          <img src="/mvp/calendar.svg" alt="calendar" className="w-3 h-3.5" />
        </button>
      )}

      {menuPosition && (
        <div
          className="absolute z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <ContextMenu x={0} y={0} onClose={onMenuClose}>
            {Object.entries(timeRangeLabels).map(([value, label]) => (
              <button
                key={value}
                className="w-full text-left"
                onClick={() => {
                  onTimeRangeChange(value as TimeRange);
                  onMenuClose();
                }}
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
