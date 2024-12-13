import { IMessage } from "@pages/Workspace/components/ChatPreview";
import { formatDateString } from "@utils/format";

interface MessageCardProps {
  menssage: IMessage;
}

const MessageCard = ({ menssage }: MessageCardProps) => {
  return menssage.type !== "user" ? (
    <div className="flex gap-[10px]">
      <div className="bg-white w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
        <img src="/img/sofia.svg" alt="sofia" />
        <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
      </div>
      <div className="flex flex-1 flex-col gap-[4px] items-start">
        <p className="p-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px] bg-[#b1f6f0] rounded-lg">
          {menssage.text}
        </p>
        <p className="px-[16px] leading-[18px] font-poppinsRegular text-[12px] text-gray-500">
          {formatDateString(menssage.created_at)}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex gap-[10px]">
      <div className="flex flex-1 flex-col gap-[4px] items-end">
        <p className="p-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px] bg-white rounded-lg">
          {menssage.text}
        </p>
        <p className="px-[16px] leading-[18px] font-poppinsRegular text-[12px] text-gray-500">
          {formatDateString(menssage.created_at)}
        </p>
      </div>
      <div className="bg-[#82c0cf] w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
        <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
      </div>
    </div>
  );
};

export default MessageCard;
