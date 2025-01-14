import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { ConversationCard } from "./ConversationCard";
import { useParams } from "react-router-dom";
import { IntegrationType, scrollableTabs } from "@interfaces/integrations";

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
  const fixedTab = "Todas";
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<IntegrationType | "Todas">(
    fixedTab
  );
  const { register } = useForm();
  const [startIndex, setStartIndex] = useState(0);

  const visibleScrollableTabs = scrollableTabs.slice(
    startIndex,
    startIndex + 3
  );
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + 3 < scrollableTabs.length;

  const filteredConversations = conversations.filter(
    conv => activeTab === fixedTab || conv.integration === activeTab
  );

  const integrationTabsNames = {
    [IntegrationType.WHATSAPP]: "WhatsApp",
    [IntegrationType.MESSENGER]: "Messenger",
    [IntegrationType.CHAT_WEB]: "Web",
  };

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
    <div className="w-[345px] h-full bg-sofia-blancoPuro border border-app-lightGray rounded-l-lg flex flex-col">
      <div className="flex flex-col gap-6 p-[10px] flex-none">
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
        <div className="w-[327px] flex flex-col items-start">
          <div className="relative flex items-center w-full">
            {/* Fixed "Todas" tab */}
            <button
              onClick={() => setActiveTab(fixedTab)}
              className={`${tabBaseStyles} ${
                activeTab === fixedTab ? tabSelectedStyles : tabNormalStyles
              }`}
            >
              {fixedTab}
            </button>

            <div className="flex-1 flex items-center max-w-[285px]">
              {/* Left chevron */}
              {canScrollLeft && (
                <button onClick={scrollLeft} className="p-1 shrink-0">
                  <IoChevronBack className="w-4 h-4 text-app-newGray" />
                </button>
              )}

              {/* Scrollable tabs */}
              <div className="flex gap-4 mx-2 overflow-hidden flex-1">
                {visibleScrollableTabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${tabBaseStyles} ${
                      activeTab === tab ? tabSelectedStyles : tabNormalStyles
                    }`}
                  >
                    {integrationTabsNames[tab]}
                  </button>
                ))}
              </div>

              {/* Right chevron */}
              {canScrollRight && (
                <button onClick={scrollRight} className="p-1 shrink-0">
                  <IoChevronForward className="w-4 h-4 text-app-newGray" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
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
