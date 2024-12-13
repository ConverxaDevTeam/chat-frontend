import { getConversationByOrganizationIdAndById } from "@services/conversations";
import { AppDispatch, RootState } from "@store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MessageCard from "./MessageCard";
import { uploadConversation } from "@store/actions/conversations";

const ConversationDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

  const conversation = conversations.find(
    conversation => conversation.id === Number(id)
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
    setText("");
  };

  useEffect(() => {
    getConversationDetailById();
  }, [id]);

  return (
    <div className="flex flex-col flex-1 gap-[10px] bg-app-c2 border-[2px] border-app-c3 rounded-2xl p-[10px]">
      <div className="flex flex-col flex-1 bg-app-c1 rounded-2xl p-[10px] gap-[10px] overflow-auto border-[1px] border-app-c3">
        {conversation?.messages &&
          conversation.messages.map(message => (
            <MessageCard key={`chat-msg-${message.id}`} menssage={message} />
          ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex gap-[10px] items-center"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 bg-app-c1 border-[1px] border-app-c3 rounded-lg p-[10px] text-[14px] text-black"
        />
        <button
          type="submit"
          className="bg-[#15ECDA] hover:bg-[#0F9D8C] text-black font-bold hover:text-white rounded w-[120px] h-[40px]"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ConversationDetail;
