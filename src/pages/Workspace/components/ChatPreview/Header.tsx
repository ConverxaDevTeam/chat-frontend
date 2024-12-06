import { IConversation } from ".";
import { ConfigWebChat } from "../CustomizeChat";
import IconArrow from "./IconArrow";
import IconClose from "./IconClose";

interface HeaderProps {
  conversation: IConversation | null;
  config: ConfigWebChat;
  setConversation: (conversation: IConversation | null) => void;
}

const Header = ({ conversation, config, setConversation }: HeaderProps) => {
  return (
    <div
      className="py-[20px] px-[10px] flex flex-col gap-[10px] relative"
      style={{
        backgroundColor: config.bg_color,
        color: config.text_title,
      }}
    >
      {/* <img
        src={`${config.url_assets}/assets/${config.icon_close}`}
        className="select-none w-[18px] h-[18px] absolute top-[10px] right-[10px] cursor-pointer"
        alt="Chat"
      /> */}
      <IconClose
        color={config.text_title}
        className="select-none w-[18px] h-[18px] absolute top-[10px] right-[10px] cursor-pointer"
      />
      {conversation ? (
        <div className="flex gap-[10px] items-center">
          <IconArrow
            className="select-none w-[32px] h-[32px] cursor-pointer"
            onClick={() => setConversation(null)}
            color={config.text_title}
          />
          <img
            src={`${config.url_assets}/logos/${config.logo}`}
            className="select-none w-[50px] h-[50px] cursor-pointer bg-white rounded-full p-[6px]"
            alt="Chat"
          />
          <p className="font-medium text-[20px]">{config.title}</p>
        </div>
      ) : (
        <>
          <p className="text-center font-semibold text-[20px]">
            {config.sub_title}
          </p>
          <p
            className="text-[12px] text-center font-medium"
            style={{
              backgroundColor: config.bg_color,
              color: config.text_title,
            }}
          >
            {config.description}
          </p>
        </>
      )}
    </div>
  );
};

export default Header;
