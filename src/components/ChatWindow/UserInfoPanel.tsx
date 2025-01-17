import { ConversationDetailResponse } from "@interfaces/conversation";

interface UserInfoPanelProps {
  conversation?: ConversationDetailResponse;
}

export const UserInfoPanel = ({ conversation }: UserInfoPanelProps) => {
  return (
    <div className="w-full h-full flex-shrink-0 rounded-lg border border-[#EDEDED] bg-sofia-blancoPuro">
      {/* Contenido del panel */}
    </div>
  );
};
