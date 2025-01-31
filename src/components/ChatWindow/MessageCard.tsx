import { apiUrls } from "@config/config";
import { Avatar } from "@components/ChatWindow/Avatar";
import { ConversationResponseMessage } from "@interfaces/conversation";
import { formatDateOrTime } from "@utils/format";
import { MessageType } from "@utils/interfaces";
import ReactMarkdown from "react-markdown";
import { ConfigWebChat } from "@pages/Workspace/components/CustomizeChat";

interface MessageCardProps {
  userName: string;
  message: ConversationResponseMessage;
  config?: ConfigWebChat;
}

const defaultConfig: ConfigWebChat = {
  id: 0,
  name: "Default",
  cors: [],
  url_assets: "",
  title: "Default Title",
  sub_title: "Default Subtitle",
  description: "Default Description",
  logo: "",
  horizontal_logo: "",
  edge_radius: 8,
  bg_color: "#FFFFFF",
  bg_chat: "#F5F5F5",
  bg_user: "#FFFFFF",
  bg_assistant: "#d0fbf8",
  text_color: "#000000",
  text_date: "#a6a8ab",
  button_color: "#007BFF",
  text_title: "#001126",
  message_radius: 8,
  button_text: "Send",
};

const MessageContainer = ({
  children,
  align,
}: {
  children: React.ReactNode;
  align: "start" | "end";
}) => {
  return (
    <div className={`flex justify-${align} max-w-[546px]`}>
      <div className={`flex flex-col items-start gap-2`}>
        <div className={`flex items-start gap-2`}>{children}</div>
      </div>
    </div>
  );
};

const MessageHeader = ({
  message,
  config,
  userName,
}: {
  message: ConversationResponseMessage;
  config: ConfigWebChat;
  userName: string;
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span
        className="text-[14px] font-bold"
        style={{ color: config.text_color }}
      >
        {userName}
      </span>
      <span
        className="text-[14px] font-bold"
        style={{ color: config.text_date }}
      >
        {formatDateOrTime(message.created_at)}
      </span>
    </div>
  );
};

const renderContent = (
  message: ConversationResponseMessage,
  textColor: string
) => {
  return (
    <div className="flex flex-col gap-2">
      {message.images?.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index + 1}`}
          className="rounded-lg w-[200px] h-[200px] object-cover"
          onLoad={() => {
            if (imageUrl.startsWith("blob:")) {
              URL.revokeObjectURL(imageUrl);
            }
          }}
        />
      ))}
      {message.audio && (
        <audio
          controls
          src={apiUrls.mediaAudio(message.audio)}
          className="w-[220px] h-[35px]"
        />
      )}
      {message.text && (
        <div className={`text-[14px] font-medium`} style={{ color: textColor }}>
          {message.audio && <span className="font-bold">Transcripcion: </span>}
          <ReactMarkdown
            components={{
              p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              a: ({ ...props }) => (
                <a className="text-blue-500 hover:underline" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc ml-4 mb-2" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal ml-4 mb-2" {...props} />
              ),
              code: ({ ...props }) => (
                <code className="bg-gray-100 px-1 rounded" {...props} />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const hexToRgb = (hex: string) => {
  // Remove the hash if present
  const sanitizedHex = hex.replace(/^#/, "");

  // Handle both 3-digit and 6-digit hex
  const fullHex =
    sanitizedHex.length === 3
      ? sanitizedHex
          .split("")
          .map(char => char + char)
          .join("")
      : sanitizedHex;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return { r, g, b };
};

const getContrastingTextColor = (backgroundColor: string): string => {
  const { r, g, b } = hexToRgb(backgroundColor);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  console.log(luminance);
  return luminance > 186 ? "#000000" : "#FFFFFF";
};

const MessageCard = ({
  message,
  userName,
  config = defaultConfig,
}: MessageCardProps) => {
  if (message.type === MessageType.AGENT || message.type === MessageType.HITL) {
    const textColor = getContrastingTextColor(config.bg_assistant);
    return (
      <MessageContainer align="start">
        <div className="flex flex-col gap-1">
          <div className="w-[40px] h-[40px] px-[7px] py-[10px] flex flex-col items-start rounded-full bg-sofia-electricGreen relative">
            <img src="/icon.svg" alt="sofia" className="w-6 h-6" />
            <div className="w-3 h-3 bg-green-500 absolute border-2 border-white rounded-full -bottom-0.5 -right-0.5" />
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <MessageHeader
            message={message}
            config={config}
            userName={userName}
          />
          <div
            className="flex justify-center items-center self-stretch p-2 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.10)]"
            style={{
              backgroundColor: config.bg_assistant,
              borderRadius: config.message_radius,
            }}
          >
            {renderContent(message, textColor)}
          </div>
        </div>
      </MessageContainer>
    );
  }
  const textColor = getContrastingTextColor(config.bg_user);

  return (
    <MessageContainer align="end">
      <div className="flex flex-col items-end gap-1">
        <MessageHeader message={message} config={config} userName={userName} />
        <div
          className="flex justify-center items-center self-stretch p-2 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.10)]"
          style={{
            backgroundColor: config.bg_user,
            borderRadius: config.message_radius,
          }}
        >
          {renderContent(message, textColor)}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Avatar avatar={null} secret={userName} className="w-[40px] h-[40px]" />
      </div>
    </MessageContainer>
  );
};

export default MessageCard;
