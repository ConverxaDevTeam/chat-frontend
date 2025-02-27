import { ConversationDetailResponse } from "@interfaces/conversation";
import { Avatar } from "./Avatar";
import { formatTime } from "@utils/format";

interface UserInfoPanelProps {
  conversation?: ConversationDetailResponse;
}

export const UserInfoPanel = ({ conversation }: UserInfoPanelProps) => {
  const totalTime = conversation?.messages.reduce(
    (total, message) => total + (message.time || 0),
    0
  ) || 0;
  const formattedTime = formatTime(totalTime);

  return (
    <div className="w-full h-full flex-shrink-0 rounded-lg border border-app-lightGray bg-sofia-blancoPuro p-[13px]">
      {/* Header verde */}
      <div className=" h-[160px] flex-shrink-0 rounded-lg bg-sofia-electricLight mb-4">
        <div className="flex flex-col items-center justify-center h-full">
          <Avatar
            avatar={null}
            secret={conversation?.chat_user?.secret ?? ""}
            className="w-[80px] h-[80px]"
          />
          <div className="text-center">
            <div className="text-[16px] font-semibold text-center text-sofia-superDark">
              {conversation?.chat_user?.secret}
            </div>
            <div className="text-[14px] font-normal text-center text-sofia-superDark">
              +502 56 78 90 12
            </div>
          </div>
        </div>
      </div>

      {/* Contadores */}
      <div className="flex justify-between mb-4">
        <div className="text-center w-1/2 px-2">
          <div className="text-[32px] font-bold text-sofia-superDark truncate">
            {conversation?.messages.length}
          </div>
          <div className="text-[14px] font-normal text-sofia-superDark">
            Mensajes Totales
          </div>
        </div>
        <div className="text-center w-1/2 px-2">
          <div className="group relative">
            <div className="text-[32px] font-bold text-sofia-superDark truncate group-hover:cursor-pointer" title={formattedTime}>
              {formattedTime}
            </div>
          </div>
          <div className="text-[14px] font-normal text-sofia-superDark">
            Minutos de audio
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500">
        No hay información disponible.
      </div>
      {/* Lista de información */}
      {/* <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex w-[32px] h-[32px] p-[5px_2px] flex-col justify-center items-center rounded-[24px] border border-sofia-superDark bg-sofia-celeste">
              <item.icon className="w-5 h-5 text-sofia-superDark" />
            </div>
            <div className="flex-1">
              <div className="self-stretch text-[10px] font-bold text-app-newGray">
                {item.label}
              </div>
              <div className="self-stretch text-[14px] font-normal text-sofia-superDark">
                {item.value}
              </div>
            </div>
          </div>
        ))} */}
      {/* Ítem de integración */}
      {/* <div className="flex items-center gap-2">
          <img
            src="/mvp/messenger.svg"
            alt="messenger"
            className="w-[32px] h-[32px] rounded-[24px]"
          />
          <div className="flex-1">
            <div className="self-stretch text-[10px] font-bold text-app-newGray">
              Canal
            </div>
            <div className="self-stretch text-[14px] font-normal text-sofia-superDark">
              jesus_mtz
            </div>
          </div>
        </div> */}
    </div>
    // </div>
  );
};