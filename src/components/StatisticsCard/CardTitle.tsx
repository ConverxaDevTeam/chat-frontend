import { FaEdit } from "react-icons/fa";

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
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="w-3/4 z-10" onMouseDown={handleMouseDown}>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onFinishEdit}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          className="text-[#001126] font-quicksand text-base font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 w-full"
          autoFocus
        />
      ) : (
        <div
          onClick={onStartEdit}
          onMouseDown={handleMouseDown}
          className="flex items-center gap-2 p-2 -m-2 rounded hover:bg-white/50 cursor-pointer group select-none min-w-0"
        >
          <span className="text-[#001126] font-quicksand text-base font-semibold group-hover:text-[#001126]/80 truncate min-w-0">
            {title}
          </span>
          <FaEdit className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      )}
    </div>
  );
};
