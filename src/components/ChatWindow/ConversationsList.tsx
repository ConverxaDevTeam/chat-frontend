import { useState } from "react";
import { useForm } from "react-hook-form";

interface ConversationsListProps {
  conversations?: any[];
  onSelectConversation?: (id: number) => void;
  selectedId?: number;
}

export const ConversationsList = ({
  conversations = [],
  onSelectConversation,
  selectedId,
}: ConversationsListProps) => {
  const [activeTab, setActiveTab] = useState("Todos");
  const { register } = useForm();

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

        {/* Tabs */}
        <div className="flex gap-4 border-b border-app-c3">
          {["Todos", "Web", "Facebook", "Whatsapp"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-sofia-electricGreen text-sofia-electricGreen"
                  : "text-app-gray"
              }`}
            >
              {tab}
            </button>
          ))}
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
