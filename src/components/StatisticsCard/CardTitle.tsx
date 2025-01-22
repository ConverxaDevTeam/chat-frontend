import { FaEdit } from "react-icons/fa";
import { useEffect, useRef } from "react";

interface CardTitleProps {
  title: string;
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const CardTitle = ({
  title,
  isEditing,
  onTitleChange,
  onStartEdit,
  onFinishEdit,
  onKeyDown,
}: CardTitleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const input = inputRef.current;
    const titleDiv = titleRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTitleTouch = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onStartEdit();
    };

    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    if (input) {
      input.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    if (titleDiv) {
      titleDiv.addEventListener("touchstart", handleTitleTouch, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
      }
      if (input) {
        input.removeEventListener("touchstart", handleTouchStart);
      }
      if (titleDiv) {
        titleDiv.removeEventListener("touchstart", handleTitleTouch);
      }
    };
  }, [onStartEdit]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="w-3/4 z-10"
      onMouseDown={handleInteraction}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onFinishEdit}
          onClick={handleInteraction}
          onMouseDown={handleInteraction}
          className="text-[#001126] font-quicksand text-base font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 w-full"
          autoFocus
        />
      ) : (
        <div
          ref={titleRef}
          onClick={onStartEdit}
          onMouseDown={handleInteraction}
          className="flex items-center gap-2 p-2 -m-2 rounded hover:bg-white/50 cursor-pointer group select-none"
        >
          <span className="text-[#001126] font-quicksand text-base font-semibold group-hover:text-[#001126]/80 truncate">
            {title}
          </span>
          <FaEdit className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      )}
    </div>
  );
};
