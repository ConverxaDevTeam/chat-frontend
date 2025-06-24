import { RefObject } from "react";

interface TitleInputProps {
  inputRef: RefObject<HTMLInputElement>;
  title: string;
  onTitleChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFinishEdit: () => void;
  handleInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const TitleInput = ({
  inputRef,
  title,
  onTitleChange,
  onKeyDown,
  onFinishEdit,
  handleInteraction,
}: TitleInputProps) => (
  <input
    ref={inputRef}
    type="text"
    value={title}
    onChange={e => onTitleChange(e.target.value)}
    onKeyDown={onKeyDown}
    onBlur={onFinishEdit}
    onClick={handleInteraction}
    onMouseDown={handleInteraction}
    className="text-[#001126] text-base font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 w-full"
    autoFocus
  />
);
