import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ConversationsListProps {
  conversations?: any[];
  onSelectConversation?: (id: number) => void;
  selectedId?: number;
}

const tabBaseStyles =
  "flex flex-col justify-center font-quicksand text-xs font-semibold self-stretch whitespace-nowrap px-1";
const tabSelectedStyles =
  "bg-sofia-darkBlue text-sofia-superDark rounded flex items-center gap-2.5";
const tabNormalStyles = "text-app-newGray";

export const ConversationsList = ({
  conversations = [],
  onSelectConversation,
  selectedId,
}: ConversationsListProps) => {
  const [activeTab, setActiveTab] = useState("Todas");
  const { register } = useForm();
  const tabs = ["Todas", "Web", "Facebook", "Whatsapp", "Instagram", "Twitter"];
  const [startIndex, setStartIndex] = useState(0);

  const visibleTabs = tabs.slice(startIndex, startIndex + 4);
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + 4 < tabs.length;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setStartIndex(prev => prev - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setStartIndex(prev => prev + 1);
    }
  };

  return (
    <div className="w-[345px] h-full bg-sofia-blancoPuro border border-app-lightGray rounded-l-lg">
      <div className="w-full mx-auto flex flex-col gap-6 p-[10px]">
        {/* Search Bar */}
        <div className="relative flex h-[37px] items-center">
          <input
            type="text"
            {...register("search")}
            className="w-full h-full px-4 rounded-lg border border-app-newGray bg-sofia-blancoPuro flex items-center font-quicksand text-xs font-medium placeholder:text-app-newGray"
            placeholder="Búsqueda"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <img
              src="/mvp/magnifying-glass.svg"
              alt="Search"
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Tabs Carousel */}
        <div className="w-[327px] flex flex-col items-start gap-6">
          <div className="relative flex items-center w-full">
            <button
              onClick={scrollLeft}
              className={`absolute left-0 z-10 p-1 ${!canScrollLeft && "opacity-50 cursor-not-allowed"}`}
              disabled={!canScrollLeft}
            >
              <IoChevronBack className="w-4 h-4 text-app-newGray" />
            </button>

            <div className="flex gap-4 mx-8 overflow-hidden">
              {visibleTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${tabBaseStyles} ${
                    activeTab === tab ? tabSelectedStyles : tabNormalStyles
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={scrollRight}
              className={`absolute right-0 z-10 p-1 ${!canScrollRight && "opacity-50 cursor-not-allowed"}`}
              disabled={!canScrollRight}
            >
              <IoChevronForward className="w-4 h-4 text-app-newGray" />
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation?.(conversation.id)}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                selectedId === conversation.id
                  ? "bg-sofia-celeste"
                  : "hover:bg-sofia-background"
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-app-c3">
                {/* Add avatar image or initials here */}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="font-medium">{conversation.name}</h3>
                <p className="text-sm text-app-text truncate">
                  {conversation.lastMessage}
                </p>
              </div>

              {/* Time and Status */}
              <div className="text-right">
                <p className="text-xs text-app-text">{conversation.time}</p>
                {conversation.unread && (
                  <span className="inline-block px-2 py-1 text-xs bg-sofia-electricGreen text-app-white rounded-full">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
