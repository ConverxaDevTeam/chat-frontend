import { useEffect, useRef } from "react";

interface UseTitleInteractionProps {
  onStartEdit: () => void;
}

export const useTitleInteraction = ({
  onStartEdit,
}: UseTitleInteractionProps) => {
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

  return {
    containerRef,
    inputRef,
    titleRef,
    handleInteraction,
  };
};
