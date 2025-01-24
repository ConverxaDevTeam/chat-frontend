import { useEffect } from "react";
import { useTitleInteraction } from "./hooks/useTitleInteraction";
import { TitleInput } from "./components/TitleInput";
import { TitleDisplay } from "./components/TitleDisplay";

interface CardTitleProps {
  title: string;
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CardTitle = ({
  title,
  isEditing,
  onTitleChange,
  onStartEdit,
  onFinishEdit,
  onKeyDown,
}: CardTitleProps) => {
  const { containerRef, inputRef, titleRef, handleInteraction } =
    useTitleInteraction({
      onStartEdit,
    });

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

  return (
    <div
      ref={containerRef}
      className="w-3/4 z-10"
      onMouseDown={handleInteraction}
    >
      {isEditing ? (
        <TitleInput
          inputRef={inputRef}
          title={title}
          onTitleChange={onTitleChange}
          onKeyDown={onKeyDown}
          onFinishEdit={onFinishEdit}
          handleInteraction={handleInteraction}
        />
      ) : (
        <TitleDisplay
          titleRef={titleRef}
          title={title}
          onStartEdit={onStartEdit}
          handleInteraction={handleInteraction}
        />
      )}
    </div>
  );
};
