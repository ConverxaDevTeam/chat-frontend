import { useForm } from "react-hook-form";
import { MessageForm } from "@components/ChatWindow/MessageForm";
import {
  getConversationByOrganizationIdAndById,
  sendMessage,
} from "@services/conversations";
import { AppDispatch, RootState } from "@store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MessageCard from "../../components/ChatWindow/MessageCard";
import { uploadConversation } from "@store/actions/conversations";
import { FormInputs } from "@interfaces/conversation";
import { IConversation } from "@utils/interfaces";

const ConversationDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

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
  }, []);

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

  return (
    <div className="flex flex-col flex-1 gap-[10px] bg-app-c2 border-[2px] border-app-c3 rounded-2xl p-[10px]">
      <div className="flex flex-col flex-1 bg-app-c1 rounded-2xl p-[10px] gap-[10px] overflow-auto border-[1px] border-app-c3">
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
  );
};

export default ConversationDetail;
