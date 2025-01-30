import { Avatar } from "./Avatar";

interface ChatHeaderProps {
  avatar: string | null;
  secret: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onMenuClick: (e: React.MouseEvent) => void;
}

export const ChatHeader = ({
  avatar,
  secret,
  searchTerm,
  onSearchChange,
  onMenuClick,
}: ChatHeaderProps) => {
  return (
    <div className="h-[89px] flex-shrink-0 border-t border-r border-b border-app-lightGray bg-sofia-electricOlive rounded-tr-lg">
      <div className="flex items-center p-4 gap-3">
        <Avatar avatar={avatar} secret={secret} className="flex-none" />
        <div className="max-w-[calc(50%-3rem)] flex flex-col items-start">
          <h3 className="self-stretch text-sofia-superDark text-xl font-semibold truncate">
            {secret}
          </h3>
          <span className="text-sofia-superDark text-xs font-medium">
            En línea
          </span>
        </div>
        <button
          className="w-6 h-6 flex items-center justify-center"
          onClick={onMenuClick}
        >
          <img src="/mvp/three-dots.svg" alt="Menu" className="w-6 h-6" />
        </button>
        <div className="flex-1" />
        <div className="relative">
          <input
            type="text"
            placeholder="Búsqueda"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="flex w-[149px] h-[37px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-gray bg-sofia-blancoPuro text-xs font-normal placeholder:text-[#A6A8AB]"
          />
          <img
            src="/mvp/magnifying-glass.svg"
            alt="Buscar"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
};
