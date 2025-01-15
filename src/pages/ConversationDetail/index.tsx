import { useForm } from "react-hook-form";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import { ConversationsList } from "@components/ChatWindow/ConversationsList";
import {
  getConversationByOrganizationIdAndById,
  sendMessage,
} from "@services/conversations";
import { AppDispatch, RootState } from "@store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MessageCard from "../../components/ChatWindow/MessageCard";
import { uploadConversation } from "@store/actions/conversations";
import { FormInputs } from "@interfaces/conversation";
import { IConversation } from "@utils/interfaces";
import { getConversationsByOrganizationId } from "@store/actions/conversations";
import { useAppSelector } from "@store/hooks";
import { ConversationListItem } from "@interfaces/conversation";
import ContextMenu from "../../components/ContextMenu";

const ConversationDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
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
  }, [organizationId]);

  const conversation = conversations.find(
    (conversation: IConversation) => conversation.id === Number(id)
  );

  const getConversationDetailById = async () => {
    try {
      if (!id || !selectOrganizationId) return;
      const response = await getConversationByOrganizationIdAndById(
        selectOrganizationId,
        Number(id)
      );
      dispatch(uploadConversation(response));
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

  return (
    <div className="flex-1 grid grid-cols-[minmax(0,1fr)] md:grid-cols-[345px,minmax(0,1fr)] xl:grid-cols-[345px,minmax(0,1fr),248px] min-h-0">
      {showContextMenu.show && (
        <ContextMenu
          x={showContextMenu.x}
          y={showContextMenu.y}
          onClose={() => setShowContextMenu({ show: false, x: 0, y: 0 })}
        >
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            Exportar Chat
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            Marcar como leído
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-500">
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
      <div className="min-h-0 overflow-hidden bg-sofia-blancoPuro">
        <div className="grid grid-rows-[auto,1fr] h-full">
          {/* Chat Header */}
          <div className="h-[89px] flex-shrink-0 border-t border-r border-b border-[#EDEDED] bg-[#BAF88F] rounded-tr-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img
                  src="/default-avatar.png"
                  alt="Agent"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-base font-medium">
                    {conversation?.user?.id}
                  </h3>
                  <span className="text-sm text-gray-600">En línea</span>
                </div>
              </div>
              <button
                onClick={e =>
                  setShowContextMenu({ show: true, x: e.clientX, y: e.clientY })
                }
                className="p-2"
              >
                <span className="text-xl">...</span>
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="grid grid-rows-[1fr,auto] gap-[10px] bg-app-c2 p-[10px] min-h-0">
            <div className="bg-app-c1 rounded-2xl p-[10px] gap-[10px] overflow-auto border-[1px] border-app-c3">
              {conversation?.messages?.map(message => (
                <MessageCard key={`chat-msg-${message.id}`} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <MessageForm
              form={{ register, handleSubmit, isSubmitting }}
              onSubmit={onSubmit}
              conversation={conversation}
              user={{ id: user?.id ?? -1 }}
            />
          </div>
        </div>
      </div>

      {/* Right Column - User Info */}
      <div className="hidden xl:block border-l border-app-c3 min-h-0">
        {/* Placeholder for user info */}
      </div>
    </div>
  );
};

export default ConversationDetail;
