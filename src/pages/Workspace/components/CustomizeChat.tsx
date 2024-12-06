import Loading from "@components/Loading";
import { getIntegrationWebChat } from "@services/integration";
import { RootState } from "@store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatEditor from "./ChatEditor";
import { getDefaultDepartment } from "@services/department";
import EditTexts from "./EditTexts";
import EditCors from "./EditCors";

interface CustomizeChatProps {
  onClose: () => void;
}
export enum IntegracionType {
  CHAT_WEB = "chat_web",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export interface ConfigWebChat {
  id: number;
  name: string;
  cors: string[];
  url_assets: string;
  title: string;
  sub_title: string;
  description: string;
  logo: string;
  horizontal_logo: string;
  icon_chat: string;
  icon_close: string;
  edge_radius: number;
  bg_color: string;
  bg_chat: string;
  bg_user: string;
  bg_assistant: string;
  text_color: string;
  text_date: string;
  button_color: string;
  bgColor: string;
}

export interface Integracion {
  id: number;
  created_at: string;
  updated_at: string;
  type: IntegracionType;
  config: ConfigWebChat;
}

const CustomizeChat = ({ onClose }: CustomizeChatProps) => {
  const [integration, setIntegration] = useState<Integracion | null>(null);
  const [viwer, setViwer] = useState("cors");
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const searchIntegrationWebChat = async (selectOrganizationId: number) => {
    const responseDepartament =
      await getDefaultDepartment(selectOrganizationId);

    const response = await getIntegrationWebChat(
      responseDepartament.department.id,
      selectOrganizationId
    );
    if (response) {
      setIntegration(response);
    }
  };

  useEffect(() => {
    if (selectOrganizationId) {
      searchIntegrationWebChat(selectOrganizationId);
    }
  }, []);

  return (
    <div className="w-[700px] bg-white p-[20px] shadow-lg rounded-md">
      {integration ? (
        <div className="flex flex-col gap-[20px] min-h-[400px]">
          <div className="flex w-full">
            <button
              onClick={() => setViwer("cors")}
              className={`${
                viwer === "cors"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex-1 py-2 rounded-tl-md`}
            >
              Script
            </button>
            <button
              onClick={() => setViwer("text")}
              className={`${
                viwer === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex-1 py-2`}
            >
              Textos
            </button>
            <button
              onClick={() => setViwer("interface")}
              className={`${
                viwer === "interface"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } flex-1 py-2 rounded-tr-md`}
            >
              Interface
            </button>
          </div>
          {viwer === "cors" && (
            <EditCors
              integration={integration}
              setIntegration={setIntegration}
            />
          )}
          {viwer === "text" && (
            <EditTexts
              integration={integration}
              setIntegration={setIntegration}
            />
          )}
          {viwer === "interface" && (
            <ChatEditor
              integration={integration}
              setIntegration={setIntegration}
            />
          )}
          <div className="flex justify-end space-x-2 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 shadow"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CustomizeChat;
