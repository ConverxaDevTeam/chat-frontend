import { apiUrls } from "@config/config";
import { formatDateString } from "@utils/format";
import { IMessage, MessageFormatType, MessageType } from "@utils/interfaces";

interface MessageCardProps {
  message: IMessage;
}

const MessageCard = ({ message }: MessageCardProps) => {
  if (message.type === MessageType.AGENT || message.type === MessageType.HITL) {
    return (
      <div className="flex gap-[10px]">
        <div className="bg-white w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
          <img src="/img/sofia.svg" alt="sofia" />
          <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
        </div>
        <div className="flex flex-1 flex-col gap-[4px] items-start">
          <p
            className={`p-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px] rounded-lg ${message.type === MessageType.HITL ? "bg-[#ffd6ff]" : "bg-[#b1f6f0]"}`}
          >
            {message.text}
          </p>
          <p className="px-[16px] leading-[18px] font-poppinsRegular text-[12px] text-gray-500">
            {formatDateString(message.created_at)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-[10px]">
      <div className="flex flex-1 flex-col gap-[4px] items-end">
        {message.format === MessageFormatType.AUDIO && message.audio && (
          <audio
            controls
            src={apiUrls.mediaAudio(message.audio)}
            className="w-[220px] h-[35px]"
          />
        )}
        <p className="p-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px] bg-white rounded-lg">
          {message.format === MessageFormatType.AUDIO && (
            <strong>Transcripcion: </strong>
          )}
          {message.text}
        </p>
        <p className="px-[16px] leading-[18px] font-poppinsRegular text-[12px] text-gray-500">
          {formatDateString(message.created_at)}
        </p>
      </div>
      <div className="bg-[#82c0cf] w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
        <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
      </div>
    </div>
  );
};

export default MessageCard;
