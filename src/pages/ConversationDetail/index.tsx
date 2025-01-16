import { useForm } from "react-hook-form";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import { ConversationsList } from "@components/ChatWindow/ConversationsList";
import {
  getConversationByOrganizationIdAndById,
  sendMessage,
  exportConversation,
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
import ContextMenu from "../../components/ContextMenu";
import { Avatar } from "@components/ChatWindow/Avatar";
import { alertError } from "@utils/alerts";

const ConversationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] =
    useState<ConversationDetailResponse | null>(null);

  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );

  const organizationId = useAppSelector(
    state => state.auth.selectOrganizationId
  );
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    if (!data.message.trim()) return;

    try {
      const success = await sendMessage(Number(id), data.message);
      if (success) {
        reset();
        await getConversationDetailById();
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const handleSelectConversation = (userId: number) => {
    navigate(`/conversation/detail/${userId}`);
  };

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

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 grid grid-cols-[minmax(0,1fr)] md:grid-cols-[345px,minmax(0,1fr)] xl:grid-cols-[345px,minmax(0,1fr),248px] min-h-0">
      {showContextMenu.show && (
        <ContextMenu
          x={showContextMenu.x}
          y={showContextMenu.y}
          onClose={() => setShowContextMenu({ show: false, x: 0, y: 0 })}
        >
          <button
            className="w-full text-left"
            onClick={() => {
              if (selectOrganizationId && conversation) {
                exportConversation(
                  selectOrganizationId,
                  conversation.id,
                  "csv",
                  conversation
                );
              }
            }}
          >
            Exportar Chat CSV
          </button>
          <button
            className="w-full text-left"
            onClick={() => {
              if (selectOrganizationId && conversation) {
                exportConversation(
                  selectOrganizationId,
                  conversation.id,
                  "pdf",
                  conversation
                );
              }
            }}
          >
            Exportar Chat PDF
          </button>
          <button
            className="w-full text-left"
            onClick={() => {
              if (selectOrganizationId && conversation) {
                exportConversation(
                  selectOrganizationId,
                  conversation.id,
                  "excel",
                  conversation
                );
              }
            }}
          >
            Exportar Chat EXCEL
          </button>
          <button
            className="w-full text-left text-red-500"
            onClick={handleDeleteConversation}
          >
            Eliminar Chat
          </button>
        </ContextMenu>
      )}
      {/* Left Column - Conversations List */}
      <div className="hidden md:block min-h-0">
        <ConversationsList
          conversations={conversationsList}
          onSelectConversation={handleSelectConversation}
          selectedId={Number(id)}
        />
      </div>

      {/* Middle Column - Chat */}
      <div className="min-h-0 overflow-hidden bg-sofia-blancoPuro flex flex-col">
        {/* Chat Header */}
        <div className="h-[89px] flex-shrink-0 border-t border-r border-b border-app-lightGray bg-sofia-electricOlive rounded-tr-lg">
          <div className="flex items-center p-4 gap-3">
            <Avatar
              avatar={null}
              secret={conversation.chat_user.secret}
              className="flex-none"
            />
            <div className="max-w-[calc(50%-3rem)] flex flex-col items-start">
              <h3 className="self-stretch text-sofia-superDark font-quicksand text-xl font-semibold truncate">
                {conversation.chat_user.secret}
              </h3>
              <span className="text-sofia-superDark font-quicksand text-xs font-medium">
                En línea
              </span>
            </div>
            <button
              className="w-6 h-6 flex items-center justify-center"
              onClick={e => {
                e.preventDefault();
                setShowContextMenu({
                  show: true,
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
            >
              <img src="/mvp/three-dots.svg" alt="Menu" className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="relative">
              <input
                type="text"
                placeholder="Búsqueda"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex w-[149px] h-[37px] pl-4 pr-9 py-2.5 justify-between items-center flex-shrink-0 rounded-lg border border-app-gray bg-sofia-blancoPuro font-quicksand text-xs font-normal placeholder:text-[#A6A8AB]"
              />
              <img
                src="/mvp/magnifying-glass.svg"
                alt="Buscar"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 bg-sofia-celeste overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {filteredMessages.map((message, index) => (
              <MessageCard key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        {conversation && (
          <div className="h-[73px] px-5 py-3.5 flex items-center bg-[#EDEDED]">
            <MessageForm
              form={{ register, handleSubmit, isSubmitting }}
              onSubmit={onSubmit}
              conversation={conversation}
              user={{ id: user?.id ?? -1 }}
            />
          </div>
        )}
      </div>

      {/* Right Column - User Info */}
      <div className="hidden xl:block border-l border-app-c3 min-h-0">
        {/* Placeholder for user info */}
      </div>
    </div>
  );
};

export default ConversationDetail;
