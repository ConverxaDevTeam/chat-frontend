import { IConversation } from "@utils/interfaces";
import { ConfigWebChat } from "../CustomizeChat";
import IconClose from "./IconClose";
import { Avatar } from "@components/ChatWindow/Avatar";
import { ArrowBackIcon } from "@components/Icons/ArrowBack";

interface HeaderProps {
  conversation: IConversation | null;
  config: ConfigWebChat;
  setConversation: (conversation: IConversation | null) => void;
}

const Header = ({ conversation, config, setConversation }: HeaderProps) => {
  return (
    <div
      className="flex items-center justify-between py-[24px] px-0"
      style={{
        backgroundColor: config.bg_color,
        color: config.text_title,
      }}
    >
      <div>
        {conversation ? (
          <div
            className="flex gap-[10px] items-center"
            style={{ color: config.text_title }}
          >
            <ArrowBackIcon
              className="w-[25px] h-[25px] m-[10px] cursor-pointer"
              onClick={() => setConversation(null)}
            />
            <Avatar
              avatar={config.logo}
              secret={""}
              className=" rounded-full"
              borderColor={config.text_title}
            />

            <p className="font-semibold text-[20px]">{config.title}</p>
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
              }}
            >
              {config.description}
            </p>
          </>
        )}
      </div>
      <IconClose
        color={config.text_title}
        className="select-none w-[22px] h-[22px] cursor-pointer mr-[10px]"
      />
    </div>
  );
};

export default Header;
