import { apiUrls } from "@config/config";
import { Avatar } from "@components/ChatWindow/Avatar";
import { ConversationResponseMessage } from "@interfaces/conversation";
import { formatDateOrTime } from "@utils/format";
import { MessageType } from "@utils/interfaces";
import ReactMarkdown from "react-markdown";

interface MessageCardProps {
  userName: string;
  message: ConversationResponseMessage;
}

const renderContent = (message: ConversationResponseMessage) => {
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
        <p className={`text-[14px] font-quicksand font-medium text-app-text`}>
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
        </p>
      )}
    </div>
  );
};

const MessageCard = ({ message, userName }: MessageCardProps) => {
  if (message.type === MessageType.AGENT || message.type === MessageType.HITL) {
    return (
      <div className="inline-flex items-start gap-2 max-w-[546px]">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1">
              <div className="w-[40px] h-[40px] px-[7px] py-[10px] flex flex-col items-start rounded-full bg-sofia-electricGreen relative">
                <img src="/icon.svg" alt="sofia" className="w-6 h-6" />
                <div className="w-3 h-3 bg-green-500 absolute border-2 border-white rounded-full -bottom-0.5 -right-0.5" />
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex justify-center items-center gap-2">
                <span className="text-[14px] font-quicksand font-bold text-sofia-superDark">
                  SOF.IA
                </span>
                <span className="text-[14px] font-quicksand font-bold text-app-newGray">
                  {formatDateOrTime(message.created_at)}
                </span>
              </div>
              <div className="flex justify-center items-center self-stretch p-2 rounded-lg bg-sofia-secundario shadow-[2px_2px_4px_0px_rgba(0,0,0,0.10)]">
                {renderContent(message)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end max-w-[546px] ml-auto">
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-end gap-1">
            <div className="flex justify-center items-center gap-2">
              <span className="text-[14px] font-quicksand font-bold text-sofia-superDark">
                {userName}
              </span>
              <span className="text-[14px] font-quicksand font-bold text-app-newGray">
                {formatDateOrTime(message.created_at)}
              </span>
            </div>
            <div className="flex justify-center items-center self-stretch p-2 rounded-lg bg-sofia-blancoPuro shadow-[2px_2px_4px_0px_rgba(0,0,0,0.10)]">
              {renderContent(message)}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Avatar
              avatar={null}
              secret={userName}
              className="w-[40px] h-[40px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
