import { apiUrls } from "@config/config";
import { ConversationResponseMessage } from "@interfaces/conversation";
import { formatDateOrTime } from "@utils/format";
import { MessageType } from "@utils/interfaces";
import ReactMarkdown from "react-markdown";
import { ConfigWebChat } from "@pages/Workspace/components/CustomizeChat";
import { getContrastingTextColor } from "@services/chat.service";
import ImageModal from "./ImageModal";
import { useState } from "react";

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
  bg_user: "#343E4F",
  bg_assistant: "#fff",
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
    <div className={`flex justify-${align}`}>
      <div className={`flex flex-col items-start gap-2`}>
        <div className={`flex items-start gap-2`}>{children}</div>
      </div>
    </div>
  );
};

const MessageHeader = ({
  message,
  config,
}: {
  message: ConversationResponseMessage;
  config: ConfigWebChat;
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span
        className="text-[14px] font-semibold"
        style={{ color: config.text_color }}
      >
        {message.type === MessageType.USER ? "Usuario" : "SOF.IA"}
      </span>
      <span
        className="text-[10px] font-normal"
        style={{ color: config.text_date }}
      >
        {formatDateOrTime(message.created_at)}
      </span>
    </div>
  );
};

const renderContent = (
  message: ConversationResponseMessage,
  textColor: string,
  onImageClick: (imageUrl: string) => void,
) => {
  return (
    <div className="flex flex-col gap-2">
      {message.images?.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index + 1}`}
          className="rounded-lg w-[200px] h-[200px] object-cover cursor-pointer"
          onClick={() => onImageClick(imageUrl)}
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
        <div className={`text-[14px] font-normal`} style={{ color: textColor }}>
          {message.audio && <span className="font-normal">Transcripcion: </span>}
          <ReactMarkdown
            components={{
              p: ({ ...props }) => <p className="mb-2 last:mb-0 font-normal" {...props} />,
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

const MessageCard = ({
  message,
  config = defaultConfig,
}: MessageCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };
  if (message.type === MessageType.AGENT || message.type === MessageType.HITL) {
    const textColor = getContrastingTextColor(config.bg_assistant);
    return (
      <MessageContainer align="start">
        <div className="flex flex-col gap-1">
        </div>
        <div className="flex flex-col items-start gap-1">
          <MessageHeader message={message} config={config} />
          <div
            className="flex justify-center items-center self-stretch p-2 border border-[#DBEAF2]"
            style={{
              backgroundColor: config.bg_assistant,
              borderRadius: config.message_radius + "px",
            }}
          >
            {renderContent(message, textColor, handleImageClick)}
          </div>
        </div>
        <ImageModal
        isOpen={modalOpen}
        imageUrl={selectedImage}
        onClose={() => setModalOpen(false)}
      />
      </MessageContainer>
    );
  }
  const textColor = getContrastingTextColor(config.bg_user);

  return (
    <MessageContainer align="end">
      <div className="flex flex-col items-end gap-1">
        <MessageHeader message={message} config={config} />
        <div
          className="flex justify-center items-center self-stretch p-2 border border-[#DBEAF2]"
          style={{
            backgroundColor: config.bg_user,
            borderRadius: config.message_radius + "px",
          }}
        >
          {renderContent(message, textColor, handleImageClick)}
        </div>
      </div>
      <ImageModal
      isOpen={modalOpen}
      imageUrl={selectedImage}
      onClose={() => setModalOpen(false)}
    />
    </MessageContainer>
  );
};

export default MessageCard;
