import { formatDateString } from "@utils/format";
import { IMessage } from ".";
import { configChat } from "../ChatEditor";

interface MessageUserProps {
  menssage: IMessage;
  config: configChat;
}

const MessageUser = ({ menssage, config }: MessageUserProps) => {
  return (
    <div className="flex gap-[10px]">
      <div className="flex flex-1 flex-col gap-[4px] items-end">
        <p
          className="p-[16px] rounded-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px]"
          style={{
            backgroundColor: config.bg_user,
          }}
        >
          {menssage.text}
        </p>
        <p
          className="px-[16px] leading-[18px] font-poppinsRegular text-[12px]"
          style={{
            color: config.text_date,
          }}
        >
          {formatDateString(menssage.created_at)}
        </p>
      </div>
      <div className="bg-[#82c0cf] w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
        <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
      </div>
    </div>
  );
};

export default MessageUser;
