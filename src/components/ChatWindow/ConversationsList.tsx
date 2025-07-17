import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { ConversationCard } from "./ConversationCard";
import { useParams } from "react-router-dom";
import { IntegrationType, scrollableTabs } from "@interfaces/integrations";
import { ConversationListItem } from "@interfaces/conversation";

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab = ({ label, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`${tabBaseStyles} ${isActive ? tabSelectedStyles : tabNormalStyles}`}
  >
    {label}
  </button>
);

interface ScrollButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}

const ScrollButton = ({ direction, onClick, disabled }: ScrollButtonProps) => {
  if (disabled) return null;

  return (
    <button onClick={onClick} className="p-1 shrink-0">
      {direction === "left" ? (
        <IoChevronBack className="w-4 h-4 text-app-newGray" />
      ) : (
        <IoChevronForward className="w-4 h-4 text-app-newGray mr-2" />
      )}
    </button>
  );
};

interface TabsCarouselProps {
  activeTab: IntegrationType | "Todas";
  setActiveTab: (tab: IntegrationType | "Todas") => void;
  startIndex: number;
  setStartIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TabsCarousel = ({
  activeTab,
  setActiveTab,
  startIndex,
  setStartIndex,
}: TabsCarouselProps) => {
  const fixedTab = "Todas";
  const visibleScrollableTabs = scrollableTabs.slice(
    startIndex,
    startIndex + 3
  );
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + 3 < scrollableTabs.length;

  const integrationTabsNames: Record<IntegrationType, string> = {
    [IntegrationType.WHATSAPP]: "WhatsApp",
    [IntegrationType.MESSENGER]: "Messenger",
    [IntegrationType.CHAT_WEB]: "Chat Web",
    [IntegrationType.SLACK]: "Slack",
    [IntegrationType.MESSENGER_MANUAL]: "Messenger",
    [IntegrationType.WHATSAPP_MANUAL]: "WhatsApp",
  };

  return (
    <div className="w-[327px] flex flex-col items-start">
      <div className="relative flex items-center w-full">
        <Tab
          label={fixedTab}
          isActive={activeTab === fixedTab}
          onClick={() => setActiveTab(fixedTab)}
        />

        <div className="flex-1 flex items-center max-w-[285px]">
          <ScrollButton
            direction="left"
            onClick={() => setStartIndex(prev => prev - 1)}
            disabled={!canScrollLeft}
          />

          <div className="flex gap-3 mx-1 overflow-hidden flex-1">
            {visibleScrollableTabs.map(tab => (
              <Tab
                key={tab}
                label={integrationTabsNames[tab]}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          <ScrollButton
            direction="right"
            onClick={() => setStartIndex(prev => prev + 1)}
            disabled={!canScrollRight}
          />
        </div>
      </div>
    </div>
  );
};

interface SearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: "Usuario" | "ID";
  setSearchFilter: (filter: "Usuario" | "ID") => void;
}

const SearchBox = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
}: SearchBoxProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex items-center bg-white rounded-md border border-gray-200 h-[37px]">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 h-full px-4 bg-transparent text-gray-500 text-sm placeholder:text-gray-400 focus:outline-none"
          placeholder="Búsqueda"
        />
        <button className="px-3 py-1.5 mx-2 bg-[#00D4FF] text-black text-sm font-medium rounded hover:bg-[#00C4EF] transition-colors">
          Buscar
        </button>
        {(searchQuery || searchFilter !== "Usuario") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchFilter("Usuario");
            }}
            className="p-1.5 mr-2 text-gray-400 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setSearchFilter("Usuario");
              setSearchQuery("");
            }}
            className={`w-full px-3 py-2 text-sm font-medium transition-colors rounded ${
              searchFilter === "Usuario"
                ? "bg-[#B8D4E3] text-black"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Usuario
          </button>
          {searchFilter === "Usuario" &&
            (searchQuery || searchFilter !== "Usuario") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchFilter("Usuario");
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-app-darkBlue rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
                    stroke="#001130"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
        </div>
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setSearchFilter("ID");
              setSearchQuery("");
            }}
            className={`w-full px-3 py-2 text-sm font-medium transition-colors rounded ${
              searchFilter === "ID"
                ? "bg-[#B8D4E3] text-black"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            ID
          </button>
          {searchFilter === "ID" && searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchFilter("Usuario");
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-app-darkBlue rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M7.5 2.5L2.5 7.5M2.5 2.5L7.5 7.5"
                  stroke="#001130"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ConversationsListProps {
  conversations?: ConversationListItem[];
  onSelectConversation?: (id: number) => void;
  selectedId?: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: "Usuario" | "ID";
  setSearchFilter: (filter: "Usuario" | "ID") => void;
  activeTab: IntegrationType | "Todas";
  setActiveTab: (tab: IntegrationType | "Todas") => void;
}

const tabBaseStyles =
  "flex flex-col justify-center text-xs font-medium self-stretch whitespace-nowrap px-1";
const tabSelectedStyles =
  "bg-app-darkBlue text-app-superDark rounded flex items-center gap-2.5 px-2 py-1";
const tabNormalStyles = "text-app-newGray";

export const ConversationsList = ({
  conversations = [],
  onSelectConversation,
  selectedId,
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter,
  activeTab,
  setActiveTab,
}: ConversationsListProps) => {
  const { userId } = useParams();
  const [startIndex, setStartIndex] = useState(0);

  // Ya no necesitamos filtrar aquí, los filtros se aplican en el backend
  const filteredConversations = conversations;

  return (
    <div className="w-[345px] h-full bg-app-blancoPuro border border-app-lightGray rounded-l-lg flex flex-col">
      <div className="flex flex-col gap-4 py-[24px] px-[16px] flex-none">
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <TabsCarousel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {filteredConversations.map((conversation, index) => (
            <ConversationCard
              key={`${conversation.secret}-${index}`}
              conversation={conversation}
              isSelected={
                userId
                  ? Number(userId) === conversation.id
                  : selectedId === conversation.id
              }
              onClick={() => onSelectConversation?.(conversation.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
