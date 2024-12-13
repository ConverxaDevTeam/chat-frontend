import { useForm } from "react-hook-form";
import { useHitl } from "@hooks/useHitl";
import { HitlButton } from "@components/HitlButton";
import { SendMessageButton } from "@components/SendMessageButton";
import {
  getConversationByOrganizationIdAndById,
  sendMessage,
} from "@services/conversations";
import { AppDispatch, RootState } from "@store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MessageCard from "./MessageCard";
import { uploadConversation } from "@store/actions/conversations";
import { FormInputs } from "@interfaces/conversation";
import { IConversation } from "@pages/Workspace/components/ChatPreview";

const ConversationDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInputs>();

  const { selectOrganizationId, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

  const conversation = conversations.find(
    (conversation: IConversation) => conversation.id === Number(id)
  );

  const { handleHitlAction, isLoading } = useHitl({
    conversationId: Number(id),
    userId: conversation?.user?.id?.toString(),
    currentUserId: user?.id?.toString(),
    onUpdateConversation: updatedConversation => {
      if (!updatedConversation.user) throw new Error("User not found");
      dispatch(uploadConversation(updatedConversation as IConversation));
    },
  });

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

  const onSubmit = async (data: FormInputs) => {
    if (!data.message.trim()) return;

    try {
      const success = await sendMessage(Number(id), data.message);
      if (success) {
        reset();
        // Actualizar la conversación para mostrar el nuevo mensaje
        await getConversationDetailById();
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length]);

  useEffect(() => {
    getConversationDetailById();
  }, [id, selectOrganizationId]);

  return (
    <div className="flex flex-col flex-1 gap-[10px] bg-app-c2 border-[2px] border-app-c3 rounded-2xl p-[10px]">
      <div className="flex flex-col flex-1 bg-app-c1 rounded-2xl p-[10px] gap-[10px] overflow-auto border-[1px] border-app-c3">
        {conversation?.messages?.map(message => (
          <MessageCard key={`chat-msg-${message.id}`} menssage={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-[10px] items-center"
      >
        <input
          {...register("message", { required: true })}
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-app-c1 border-[1px] border-app-c3 rounded-lg p-[10px] text-[14px] text-black"
        />

        {conversation?.user?.id === user?.id ? (
          <SendMessageButton isSubmitting={isSubmitting} />
        ) : (
          <HitlButton
            onClick={handleHitlAction}
            isLoading={isLoading}
            isAssigned={!!conversation?.user}
            currentUserHasConversation={conversation?.user?.id === user?.id}
          />
        )}
      </form>
    </div>
  );
};

export default ConversationDetail;
