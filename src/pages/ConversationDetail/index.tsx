import { useForm } from "react-hook-form";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import { ConversationsList } from "@components/ChatWindow/ConversationsList";
import {
  getConversationByOrganizationIdAndById,
  sendMessage,
  deleteConversation,
} from "@services/conversations";
import { RootState } from "@store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MessageCard from "../../components/ChatWindow/MessageCard";
import {
  ConversationDetailResponse,
  FormInputs,
} from "@interfaces/conversation";
import { getConversationsByOrganizationId } from "@store/actions/conversations";
import { useAppSelector } from "@store/hooks";
import { ConversationListItem } from "@interfaces/conversation";
import { ConversationContextMenu } from "@components/ChatWindow/ConversationContextMenu";
import { alertError } from "@utils/alerts";
import { ChatHeader } from "@components/ChatWindow/ChatHeader";
// import { UserInfoPanel } from "@components/ChatWindow/UserInfoPanel";

// Hooks
const useConversationList = (
  organizationId: number | null,
  id: string | undefined
) => {
  const [conversationsList, setConversationsList] = useState<
    ConversationListItem[]
  >([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (organizationId) {
        const data = await getConversationsByOrganizationId(organizationId);
        setConversationsList(data);
      }
    };
    fetchConversations();
  }, [organizationId, id]);

  return { conversationsList };
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
      if (!id || !selectOrganizationId) return;
      const response = await getConversationByOrganizationIdAndById(
        selectOrganizationId,
        Number(id)
      );
      setConversation(response);
    } catch (error) {
      console.error(error);
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
      const normalizedLastMessage = {
        ...lastMessage,
        images: lastMessage.images || null, // Asegurar que images sea null si es undefined
      };
      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            { ...normalizedLastMessage, time: Date.now() },
          ],
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
      console.error("Error al enviar mensaje:", error);
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

  const handleDeleteConversation = async () => {
    if (!conversation) return;

    try {
      await deleteConversation(conversation.id);
      setShowContextMenu({ show: false, x: 0, y: 0 });

      let nextConversationId = conversationsList[0]?.id;
      if (!nextConversationId) return navigate("/conversations");
      if (nextConversationId !== conversation.id)
        return navigate(`/conversation/detail/${nextConversationId}`);
      nextConversationId = conversationsList[1]?.id;
      if (!nextConversationId) return navigate("/conversations");
      navigate(`/conversation/detail/${nextConversationId}`);
    } catch (error) {
      alertError("Error al eliminar la conversación");
    }
  };

  return { showContextMenu, setShowContextMenu, handleDeleteConversation };
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

  const { conversationsList } = useConversationList(organizationId, id);
  const { conversation, messagesEndRef, getConversationDetailById } =
    useConversationDetail(id, selectOrganizationId);
  const { register, handleSubmit, isSubmitting, onSubmit } = useMessageForm(
    id,
    getConversationDetailById
  );

  const { showContextMenu, setShowContextMenu, handleDeleteConversation } =
    useContextMenu(conversation, conversationsList);
  const { searchTerm, setSearchTerm, filteredMessages } =
    useMessageSearch(conversation);

  const handleSelectConversation = (userId: number) => {
    navigate(`/conversation/detail/${userId}`);
  };

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full relative">
      {/* Drawer de conversaciones en mobile */}
      <div 
        className={`fixed md:hidden inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
          showDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowDrawer(false)}
      />
      <div 
        className={`fixed md:hidden left-0 top-0 h-full w-[345px] bg-white z-30 transform transition-transform duration-300 ease-in-out ${
          showDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ConversationsList
          conversations={conversationsList}
          onSelectConversation={(userId) => {
            handleSelectConversation(userId);
            setShowDrawer(false);
          }}
          selectedId={Number(id)}
        />
      </div>
    <div className="w-full h-full grid grid-cols-[minmax(0,1fr)] md:grid-cols-[345px,minmax(0,1fr)] xl:grid-cols-[345px,minmax(0,1fr)]">
      {showContextMenu.show && conversation && (
        <ConversationContextMenu
          x={showContextMenu.x}
          y={showContextMenu.y}
          onClose={() => setShowContextMenu({ show: false, x: 0, y: 0 })}
          conversation={conversation}
          organizationId={selectOrganizationId || 0}
          onDelete={handleDeleteConversation}
        />
      )}
      {/* Left Column - Conversations List */}
      <div className="hidden md:block h-full w-full overflow-hidden">
        <ConversationsList
          conversations={conversationsList}
          onSelectConversation={handleSelectConversation}
          selectedId={Number(id)}
        />
      </div>

      {/* Middle Column - Chat */}
      <div className="h-full w-full overflow-hidden bg-sofia-blancoPuro flex flex-col"
        style={{
          backgroundImage: "url('/mvp/background-chats.png')",
          backgroundRepeat: 'repeat', 
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}>
        {/* Chat Header */}
        <ChatHeader
          avatar={null}
          secret={
            conversation?.chat_user?.secret ??
            conversation?.chat_user?.identifier ??
            ""
          }
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

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {filteredMessages.map((message, index) => (
              <MessageCard
                key={index}
                message={message}
                userName={conversation?.chat_user?.secret ?? ""}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        {conversation && (
          <MessageForm
            form={{ register, handleSubmit, isSubmitting }}
            onSubmit={onSubmit}
            conversation={conversation}
            user={{ id: user?.id ?? -1 }}
            onUpdateConversation={getConversationDetailById}
          />
        )}
      </div>
      </div>
    </div>
  );
};

export default ConversationDetail;
