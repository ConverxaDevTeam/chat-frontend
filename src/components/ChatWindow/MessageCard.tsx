import { apiUrls } from "@config/config";
import { ConversationResponseMessage } from "@interfaces/conversation";
import { formatDateOrTime, formatDateString } from "@utils/format";
import { MessageFormatType, MessageType } from "@utils/interfaces";

interface MessageCardProps {
  message: ConversationResponseMessage;
}

const renderContent = (message: ConversationResponseMessage) => {
  return (
    <>
      {message.images?.map((imageUrl, index) => (
        <div key={index} className="mb-2">
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="max-w-[200px] rounded-lg"
            onLoad={() => {
              // Limpiamos la URL del blob cuando la imagen se carga
              if (imageUrl.startsWith("blob:")) {
                URL.revokeObjectURL(imageUrl);
              }
            }}
          />
        </div>
      ))}
      {message.audio && (
        <audio
          controls
          src={apiUrls.mediaAudio(message.audio)}
          className="w-[220px] h-[35px]"
        />
      )}
      <p
        className={`p-[16px] text-sofiaCall-dark leading-[18px] font-poppinsRegular text-[14px] rounded-lg ${
          message.type === MessageType.HITL
            ? "bg-[#ffd6ff]"
            : message.type === MessageType.AGENT
              ? "bg-[#b1f6f0]"
              : "bg-white"
        }`}
      >
        {MessageFormatType.AUDIO && <strong>Transcripcion: </strong>}
        {message.text}
      </p>
    </>
  );
};

const MessageCard = ({ message }: MessageCardProps) => {
  if (message.type === MessageType.AGENT || message.type === MessageType.HITL) {
    return (
      <div className="inline-flex items-start gap-2 max-w-[546px] group relative">
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
                <span className="text-[14px] font-quicksand font-bold text-app-text">
                  SOF.IA
                </span>
                <span className="text-[14px] font-quicksand font-bold text-app-newGray">
                  {formatDateOrTime(message.created_at)}
                </span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 text-gray-800">
                {renderContent(message)}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <div className="relative">
              <div className="absolute top-0 right-0 bg-white rounded shadow-lg py-1">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Marcar como no leído
                </div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                  Eliminar Chat
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="flex flex-col items-end gap-1">
        <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2">
          {renderContent(message)}
        </div>
        <span className="text-xs text-gray-500 px-2">
          {formatDateString(message.created_at)}
        </span>
      </div>
    </div>
  );
};

export default MessageCard;
