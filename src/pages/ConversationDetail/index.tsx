import { useForm } from "react-hook-form";
import { useDebounce } from "@hooks/useDebounce";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import { ConversationsList } from "@components/ChatWindow/ConversationsList";
import {
  getConversationByOrganizationIdAndById,
  sendMessage,
  deleteConversation,
  getChatUsersByOrganizationId,
} from "@services/conversations";
import { RootState } from "@store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MessageCard from "../../components/ChatWindow/MessageCard";
import {
  ConversationDetailResponse,
  ConversationResponseMessage,
  FormInputs,
  chatUserToConversationListItem,
} from "@interfaces/conversation";
import { useAppSelector } from "@store/hooks";
import { ConversationListItem } from "@interfaces/conversation";
import { ConversationContextMenu } from "@components/ChatWindow/ConversationContextMenu";
import { alertError } from "@utils/alerts";
import { ChatHeader } from "@components/ChatWindow/ChatHeader";
import { IntegrationType } from "@interfaces/integrations";
import ConversationHistoryModal from "@components/ChatWindow/ConversationHistoryModal";
import { ConversationWarningBanner } from "@components/ChatWindow/ConversationWarningBanner";
import EditUserDataModal from "@components/ChatWindow/EditUserDataModal";
// import { UserInfoPanel } from "@components/ChatWindow/UserInfoPanel";

// Hooks
// Hook para obtener lista de chat users (clientes) usando el nuevo endpoint
// CAMBIO: Reemplaza getConversationsByOrganizationId por getChatUsersByOrganizationId
// para obtener usuarios únicos con su conversación más reciente en lugar de todas las conversaciones
const useChatUsersForSidebar = (
  organizationId: number | null,
  id: string | undefined,
  searchQuery: string,
  searchFilter: "Usuario" | "ID",
  activeTab: IntegrationType | "Todas"
) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [conversationsList, setConversationsList] = useState<
    ConversationListItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!organizationId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Construir filtros para el backend
        const filters: {
          searchValue?: string;
          searchType?: "name" | "id";
          integrationType?: IntegrationType;
        } = {};

        if (debouncedSearchQuery) {
          filters.searchValue = debouncedSearchQuery;
          if (searchFilter === "Usuario") {
            filters.searchType = "name";
          } else if (searchFilter === "ID") {
            filters.searchType = "id";
          }
        }

        if (activeTab !== "Todas") {
          filters.integrationType = activeTab;
        }

        const response = await getChatUsersByOrganizationId(
          organizationId,
          filters
        );

        if (response.ok) {
          // Convertir chat users a conversation list items para mantener compatibilidad
          // con el componente ConversationsList existente
          const convertedList = response.chat_users.map(chatUser => {
            const converted = chatUserToConversationListItem(chatUser);
            return converted;
          });
          setConversationsList(convertedList);
        } else {
          setError(response.message || "Error al cargar los usuarios");
          setConversationsList([]);
        }
      } catch (err) {
        setError("Error inesperado al cargar los usuarios");
        setConversationsList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatUsers();
  }, [organizationId, id, debouncedSearchQuery, searchFilter, activeTab]);

  return { conversationsList, isLoading, error };
};

const useConversationDetail = (
  id: string | undefined,
  selectOrganizationId: number | null
) => {
  const [conversation, setConversation] =
    useState<ConversationDetailResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessage = useSelector(
    (state: RootState) => state.conversations.lastMessage
  );

  const getConversationDetailById = async () => {
    try {
      if (!id || !selectOrganizationId) {
        return;
      }
      const response = await getConversationByOrganizationIdAndById(
        selectOrganizationId,
        Number(id)
      );
      setConversation(response);
    } catch (error) {
      // Error handled by service
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length]);

  useEffect(() => {
    getConversationDetailById();
  }, [id]);

  useEffect(() => {
    if (
      lastMessage &&
      conversation &&
      lastMessage.conversation.id === conversation.id
    ) {
      const normalizedLastMessage: ConversationResponseMessage = {
        id: lastMessage.id,
        created_at: lastMessage.created_at,
        text: lastMessage.text,
        audio: lastMessage.audio,
        images: lastMessage.images || null,
        time: Date.now(),
        type: lastMessage.type,
        conversation: {
          id: lastMessage.conversation.id,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          user_deleted: false,
          type: "",
          config: {},
          need_human: false,
        },
      };
      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, normalizedLastMessage],
        };
      });
    }
  }, [lastMessage]);

  return {
    conversation,
    setConversation,
    messagesEndRef,
    getConversationDetailById,
  };
};

const useMessageForm = (
  id: string | undefined,
  getConversationDetailById: () => Promise<void>
) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs & { images?: File[] }) => {
    if (!data.message.trim() && !data.images?.length) return;

    try {
      const formData = new FormData();
      formData.append("message", data.message);
      formData.append("conversationId", String(id));

      if (data.images?.length) {
        data.images.forEach(file => {
          formData.append("images", file);
        });
      }

      const success = await sendMessage(formData);
      if (success) {
        reset();
        await getConversationDetailById();
      }
    } catch (error) {
      // Error handled by service
    }
  };

  return { register, handleSubmit, isSubmitting, onSubmit };
};

const useContextMenu = (
  conversation: ConversationDetailResponse | null,
  conversationsList: ConversationListItem[]
) => {
  const navigate = useNavigate();
  const [showContextMenu, setShowContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const handleDeleteConversation = async () => {
    if (!conversation) return;

    try {
      await deleteConversation(conversation.id);
      setShowContextMenu({ show: false, x: 0, y: 0 });

      let nextConversationId = conversationsList[0]?.id;
      if (!nextConversationId) return navigate("/conversations");
      if (nextConversationId !== conversation.id)
        return navigate(`/conversations/detail/${nextConversationId}`);
      nextConversationId = conversationsList[1]?.id;
      if (!nextConversationId) return navigate("/conversations");
      navigate(`/conversations/detail/${nextConversationId}`);
    } catch (error) {
      alertError("Error al eliminar la conversación");
    }
  };

  const handleShowHistory = () => {
    setShowHistoryModal(true);
  };

  const handleEditUserData = () => {
    setShowEditUserModal(true);
  };

  return {
    showContextMenu,
    setShowContextMenu,
    handleDeleteConversation,
    showHistoryModal,
    setShowHistoryModal,
    handleShowHistory,
    showEditUserModal,
    setShowEditUserModal,
    handleEditUserData,
  };
};

const useMessageSearch = (conversation: ConversationDetailResponse | null) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState<
    ConversationDetailResponse["messages"]
  >([]);

  useEffect(() => {
    if (!conversation) return;

    if (!searchTerm.trim()) {
      setFilteredMessages(conversation.messages);
      return;
    }

    const filtered = conversation.messages.filter(message =>
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [searchTerm, conversation]);

  return { searchTerm, setSearchTerm, filteredMessages };
};

const ConversationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );

  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );
  const [showDrawer, setShowDrawer] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"Usuario" | "ID">("Usuario");
  const [activeTab, setActiveTab] = useState<IntegrationType | "Todas">(
    "Todas"
  );

  const {
    conversationsList,
    isLoading: isLoadingChatUsers,
    error: chatUsersError,
  } = useChatUsersForSidebar(
    organizationId,
    id,
    searchQuery,
    searchFilter,
    activeTab
  );
  const { conversation, messagesEndRef, getConversationDetailById } =
    useConversationDetail(id, selectOrganizationId);
  const { register, handleSubmit, isSubmitting, onSubmit } = useMessageForm(
    id,
    getConversationDetailById
  );

  const {
    showContextMenu,
    setShowContextMenu,
    handleDeleteConversation,
    showHistoryModal,
    setShowHistoryModal,
    handleShowHistory,
    showEditUserModal,
    setShowEditUserModal,
    handleEditUserData,
  } = useContextMenu(conversation, conversationsList);
  const { searchTerm, setSearchTerm, filteredMessages } =
    useMessageSearch(conversation);

  const handleUserUpdated = () => {
    // Refrescar los datos de la conversación después de actualizar el usuario
    getConversationDetailById();
  };

  const handleSelectConversation = (conversationId: number) => {
    if (conversationId === 0 || !conversationId) {
      return;
    }
    navigate(`/conversations/detail/${conversationId}`);
  };

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full relative">
      {/* Drawer de conversaciones en mobile */}
      <div
        className={`fixed md:hidden inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
          showDrawer ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowDrawer(false)}
      />
      <div
        className={`fixed md:hidden left-0 top-0 h-full w-[345px] bg-white z-30 transform transition-transform duration-300 ease-in-out ${
          showDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isLoadingChatUsers ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-darkBlue mx-auto mb-2"></div>
              <p className="text-sm text-app-newGray">Cargando usuarios...</p>
            </div>
          </div>
        ) : chatUsersError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-sm text-red-600 mb-2">
                Error al cargar usuarios
              </p>
              <p className="text-xs text-app-newGray">{chatUsersError}</p>
            </div>
          </div>
        ) : (
          <ConversationsList
            conversations={conversationsList}
            onSelectConversation={userId => {
              handleSelectConversation(userId);
              setShowDrawer(false);
            }}
            selectedId={Number(id)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
      <div className="w-full h-full grid grid-cols-[minmax(0,1fr)] md:grid-cols-[345px,minmax(0,1fr)] xl:grid-cols-[345px,minmax(0,1fr)]">
        {showContextMenu.show && conversation && (
          <ConversationContextMenu
            position={{ x: showContextMenu.x, y: showContextMenu.y }}
            onClose={() => setShowContextMenu({ show: false, x: 0, y: 0 })}
            conversation={conversation}
            organizationId={selectOrganizationId || 0}
            onDelete={handleDeleteConversation}
            onShowHistory={handleShowHistory}
            onEditUserData={handleEditUserData}
          />
        )}

        {/* Left Column - Conversations List */}
        <div className="hidden md:block h-full w-full overflow-hidden">
          {isLoadingChatUsers ? (
            <div className="w-[345px] h-full bg-app-blancoPuro border border-app-lightGray rounded-l-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-darkBlue mx-auto mb-2"></div>
                <p className="text-sm text-app-newGray">Cargando usuarios...</p>
              </div>
            </div>
          ) : chatUsersError ? (
            <div className="w-[345px] h-full bg-app-blancoPuro border border-app-lightGray rounded-l-lg flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-sm text-red-600 mb-2">
                  Error al cargar usuarios
                </p>
                <p className="text-xs text-app-newGray">{chatUsersError}</p>
              </div>
            </div>
          ) : (
            <ConversationsList
              conversations={conversationsList}
              onSelectConversation={handleSelectConversation}
              selectedId={Number(id)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </div>

        {/* Middle Column - Chat */}
        <div
          className="h-full w-full overflow-hidden bg-app-blancoPuro flex flex-col"
          style={{
            backgroundImage: "url('/mvp/background-chats.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          {/* Chat Header */}
          <ChatHeader
            avatar={null}
            secret={conversation?.chat_user?.secret ?? ""}
            userName={conversation?.chat_user?.name}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onMenuClick={e => {
              e.preventDefault();
              setShowContextMenu({
                show: true,
                x: e.clientX,
                y: e.clientY,
              });
            }}
            onConversationsClick={() => setShowDrawer(true)}
          />

          {/* Warning Banner */}
          <ConversationWarningBanner
            isLastConversation={conversation?.isLastConversation}
          />

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message, index) => (
                  <MessageCard
                    key={index}
                    message={message}
                    userName={conversation?.chat_user?.secret ?? ""}
                  />
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="mb-2">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      Sin mensajes
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Aún no hay mensajes en esta conversación
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Message Input */}
          <div className="p-1">
            {conversation && (
              <MessageForm
                form={{ register, handleSubmit, isSubmitting }}
                onSubmit={onSubmit}
                conversation={{
                  id: conversation.id,
                  user: conversation.user
                    ? { id: conversation.user.id as number }
                    : undefined,
                  messages: conversation.messages,
                }}
                user={{ id: user?.id ?? -1 }}
                onUpdateConversation={getConversationDetailById}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showHistoryModal && conversation && (
        <ConversationHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          chatUserSecret={conversation.chat_user?.secret || ""}
          organizationId={selectOrganizationId || 0}
          userName={conversation.chat_user?.name || "Usuario"}
        />
      )}

      {showEditUserModal && conversation?.chat_user && (
        <EditUserDataModal
          isOpen={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          userId={conversation.chat_user.id}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default ConversationDetail;
