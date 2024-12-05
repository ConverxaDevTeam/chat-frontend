import { themeColors } from "@utils/lists";
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Integracion } from "./CustomizeChat";
import config from "@config";
import ChatPreview from "./ChatPreview";

interface ChatEditorProps {
  integration: Integracion;
}

export interface configChat {
  id: number;
  name: string;
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

const ChatEditor = ({ integration }: ChatEditorProps) => {
  const [cofigChat, setConfigChat] = useState<configChat>({
    id: 11,
    name: "Sofia",
    url_assets: config.url_assets,
    title: "Sofia Chat",
    sub_title: "Prueba Aqui Sofia Chat",
    description:
      "¡Hola! Bienvenido a Sofia. Estoy aquí para ayudarte a encontrar respuestas y soluciones rápidamente.",
    logo: "logo.png",
    horizontal_logo: "horizontal-logo.png",
    icon_chat: "icon-chat.png",
    icon_close: "icon-close.png",
    edge_radius: 10,
    bg_color: "#15ECDA",
    bg_chat: "#F5F5F5",
    bg_user: "#ffffff",
    bg_assistant: "#b1f6f0",
    text_color: "#000000",
    text_date: "#969696",
    button_color: "#15ECDA",
    bgColor: "#1accbd",
  });
  const [themeId, setThemeId] = useState<number>(0);
  const [edgeRadius, setEdgeRadius] = useState<number>(8);

  const handleSliderChange = (newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setEdgeRadius(newValue);
    }
  };

  return (
    <div className="flex gap-[20px] items-start">
      <div className="grid grid-cols-2 gap-[10px] items-start">
        <div className="flex flex-col items-start gap-[10px] flex-1 col-span-2">
          <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] rounded-t-lg pt-[4px]">
            Tema predeterminado
          </p>
          <div className="flex gap-1 p-[2px] select-none">
            {themeColors.map(theme => {
              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`w-7 h-7 bg-white rounded-full transition border-[4px] flex justify-center items-center ${
                    themeId === theme.id
                      ? "border-app-gray"
                      : "border-white cursor-pointer"
                  }`}
                  title={theme.name}
                  onClick={() => setThemeId(theme.id)}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundColor: theme.bgColor,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-start gap-[10px]">
          <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] rounded-t-lg pt-[4px]">
            Radio de ventana
          </p>
          <Slider
            min={0}
            max={16}
            step={1}
            value={edgeRadius}
            onChange={handleSliderChange}
            trackStyle={{ backgroundColor: "#ebebeb", height: 10 }}
            handleStyle={{
              borderColor: "#ebebeb",
              height: 20,
              width: 20,
              marginTop: -5,
              backgroundColor: "#fff",
            }}
            railStyle={{ backgroundColor: "#ccc", height: 10 }}
          />
        </div>

        <div className="flex flex-col items-start gap-[10px]">
          <p className="text-[12px] font-poppinsSemiBold bg-app-c3 px-[6px] rounded-t-lg pt-[4px]">
            Radio de mensajes
          </p>
          <Slider
            min={0}
            max={16}
            step={1}
            value={edgeRadius}
            onChange={handleSliderChange}
            trackStyle={{ backgroundColor: "#ebebeb", height: 10 }}
            handleStyle={{
              borderColor: "#ebebeb",
              height: 20,
              width: 20,
              marginTop: -5,
              backgroundColor: "#fff",
            }}
            railStyle={{ backgroundColor: "#ccc", height: 10 }}
          />
        </div>
      </div>

      <ChatPreview config={cofigChat} />
    </div>
  );
};

export default ChatEditor;
