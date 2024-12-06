import { themeColors } from "@utils/lists";
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Integracion } from "./CustomizeChat";
import ChatPreview from "./ChatPreview";

interface ChatEditorProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}

const ChatEditor = ({ integration, setIntegration }: ChatEditorProps) => {
  const [themeId, setThemeId] = useState<number>(0);
  const [edgeRadius, setEdgeRadius] = useState<number>(8);

  const handleSliderChange = (newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setEdgeRadius(newValue);
      setIntegration({
        ...integration,
        config: {
          ...integration.config,
          edge_radius: newValue,
        },
      });
    }
  };

  return (
    <div className="flex gap-[20px] items-start">
      <div className="grid grid-cols-2 gap-[10px] items-start flex-1">
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
                  onClick={() => {
                    setThemeId(theme.id);
                    setIntegration({
                      ...integration,
                      config: {
                        ...integration.config,
                        bg_color: theme.bgColor,
                        text_color: theme.textColor,
                      },
                    });
                  }}
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
            value={integration.config.edge_radius}
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

      <ChatPreview config={integration.config} />
    </div>
  );
};

export default ChatEditor;
