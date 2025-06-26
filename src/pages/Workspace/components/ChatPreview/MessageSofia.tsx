import { formatDateString } from "@utils/format";
import { ConfigWebChat } from "../CustomizeChat";
import { IMessage } from "@utils/interfaces";

interface MessageSofiaProps {
  menssage: IMessage;
  config: ConfigWebChat;
}

const MessageSofia = ({ menssage, config }: MessageSofiaProps) => {
  return (
    <div className="flex gap-[10px]">
      <div className="bg-white w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
        <img src="/img/sofia.svg" alt="converxa" />
        <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
      </div>
      <div className="flex flex-1 flex-col gap-[4px] items-start">
        <p
          className="p-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px]"
          style={{
            backgroundColor: config.bg_assistant,
            borderRadius: `${config.message_radius}px`,
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
    </div>
  );
};

export default MessageSofia;
