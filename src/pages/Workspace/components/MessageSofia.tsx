import { formatDateString } from "@utils/format";

type MessageSofiaProps = {
  menssage: string;
  date: string;
  bg: string;
  textDate: string;
};

const MessageSofia = ({ menssage, date, bg, textDate }: MessageSofiaProps) => {
  return (
    <div className="flex gap-[10px]">
      <div className="bg-white w-[40px] h-[40px] relative rounded-full flex justify-center items-center">
        <img src="/img/sofia.svg" alt="sofia" />
        <div className="bg-green-500 w-[18px] h-[18px] absolute border-[4px] border-sofiaCall-white rounded-full -bottom-[5px] -right-[5px]"></div>
      </div>
      <div className="flex flex-1 flex-col gap-[4px] items-start">
        <p
          className="p-[16px] rounded-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px]"
          style={{
            backgroundColor: bg,
          }}
        >
          {menssage}
        </p>
        <p
          className="px-[16px] leading-[18px] font-poppinsRegular text-[12px]"
          style={{
            color: textDate,
          }}
        >
          {formatDateString(date)}
        </p>
      </div>
    </div>
  );
};

export default MessageSofia;
