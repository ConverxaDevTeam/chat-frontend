import { useState } from "react";
import { useForm } from "react-hook-form";
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
    [IntegrationType.WHATSAP_MANUAL]: "WhatsApp",
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

interface ConversationsListProps {
  conversations?: ConversationListItem[];
  onSelectConversation?: (id: number) => void;
  selectedId?: number;
}

const tabBaseStyles =
  "flex flex-col justify-center text-xs font-medium self-stretch whitespace-nowrap px-1";
const tabSelectedStyles =
  "bg-sofia-darkBlue text-sofia-superDark rounded flex items-center gap-2.5 px-2 py-1";
const tabNormalStyles = "text-app-newGray";

export const ConversationsList = ({
  conversations = [],
  onSelectConversation,
  selectedId,
}: ConversationsListProps) => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<IntegrationType | "Todas">(
    "Todas"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [startIndex, setStartIndex] = useState(0);

  const filteredConversations = conversations.filter(conv => {
    const matchesTab = activeTab === "Todas" || conv.type === activeTab;
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      conv.secret?.toLowerCase().includes(searchTerm) ||
      conv.id?.toString().includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-[345px] h-full bg-sofia-blancoPuro border border-app-lightGray rounded-l-lg flex flex-col">
      <div className="flex flex-col gap-6 py-[24px] px-[16px] flex-none">
        <div className="relative flex h-[37px] items-center">
          <input
            type="text"
            {...useForm().register("search", {
              onChange: e => {
                const timer = setTimeout(() => {
                  setSearchQuery(e.target.value);
                }, 300);
                return () => clearTimeout(timer);
              },
            })}
            className="w-full h-full px-4 rounded-lg border border-sofia-darkBlue bg-[#FCFCFC] focus:ring-none  flex items-center text-xs font-medium placeholder:text-app-newGray"
            placeholder="Búsqueda por ID o nombre"
          />
          <img
            src="/mvp/magnifying-glass.svg"
            alt="Buscar"
            className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          />
        </div>
        <TabsCarousel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {filteredConversations.map(conversation => (
            <ConversationCard
              key={conversation.id}
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
