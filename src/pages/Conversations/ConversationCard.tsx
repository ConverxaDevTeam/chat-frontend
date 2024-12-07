import { useEffect, useState } from "react";
import { Conversation, ConversationType, MessageType } from ".";
import { convertISOToReadable } from "@utils/format";

interface ConversationCardProps {
  conversation: Conversation;
  checkAll: boolean;
}

const ConversationCard = ({
  conversation,
  checkAll,
}: ConversationCardProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    setIsChecked(checkAll);
  }, [checkAll]);
  return (
    <tr className="items-center h-[60px] text-[14px] border-b-[1px]">
      <td>
        <div className="flex gap-[20px] 2xl:gap-[30px] items-center">
          <input
            type="checkbox"
            className="w-[16px] 2xl:w-[20px] h-[16px] 2xl:h-[20px]"
            checked={isChecked || checkAll}
            onChange={handleCheckBoxChange}
          />
        </div>
      </td>
      <td>
        <p className="font-poppinsRegular text-[#212121] leading-[27px] flex-1">
          {conversation.id}
        </p>
      </td>
      <td>
        <p className="font-poppinsRegular text-[#212121] leading-[27px] flex-1">
          {conversation.messages[conversation.messages.length - 1].type ===
          MessageType.AGENT
            ? "Respondido"
            : "Pendiente"}
        </p>
      </td>
      <td>
        <p className="font-poppinsRegular text-[#212121] leading-[27px] flex-1">
          {convertISOToReadable(conversation.created_at)}
        </p>
      </td>
      <td>
        <p className="font-poppinsRegular text-[#212121] leading-[27px] flex-1">
          <strong>
            {conversation.messages[conversation.messages.length - 1].type ===
            MessageType.AGENT
              ? "Agente"
              : "Usuario"}
          </strong>
          {` ${conversation.messages[conversation.messages.length - 1].text}`}
        </p>
      </td>
      <td>
        <p className="font-poppinsRegular text-[#212121] leading-[27px] flex-1 pl-[10px]">
          {conversation.type === ConversationType.CHAT_WEB && "Web Chat"}
          {conversation.type === ConversationType.MESSENGER && "Messenger"}
          {conversation.type === ConversationType.WHATSAPP && "WhatsApp"}
        </p>
      </td>
    </tr>
  );
};

export default ConversationCard;
